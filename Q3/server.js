require("dotenv").config()

const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const { UserModel } = require("./usermodel");

var passport = require("passport"),
  FacebookStrategy = require("passport-facebook").Strategy;

const app = express();
const port = process.env.PORT;

//express session setup
app.set("trust proxy", 1);
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

//passport setup
app.use(passport.initialize());
app.use(passport.session());

//middleware
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) return next();

  // if they aren't redirect them to the home page
  res.redirect("/");
}

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECERT,
      callbackURL: process.env.CALLBACK_URL,
      profileFields: [
        "id",
        "displayName",
        "picture.width(200).height(200)",
        "first_name",
        "middle_name",
        "last_name",
        "gender",
        "link",
        "email",
        "location",
        "friends",
      ],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const users = await UserModel.findOne({
          facebookId: profile.id,
        });
        if (users) {
          return done(null, users);
        }
        const email = profile.emails[0].value;
        const photo = profile.photos[0].value;
        const { id: facebookId, displayName: name } = profile;
        const user = await UserModel.create({ email, facebookId, name ,photo});
        await user.save();
        done(false, user);
      } catch (err) {
        console.log(err);
        done(err, false, err.message);
      }
    }
  )
);
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile", { user: req.user });
});

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["public_profile,email,user_friends"],
  })
);

app.get(
  "/auth/facebook/secrets",
  passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);

mongoose.connect("mongodb://localhost:27017/testsdb", {
  useNewUrlParser: "true",
});

mongoose.connection.on("error", (err) => {
  console.log("err", err);
});

mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected");
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
