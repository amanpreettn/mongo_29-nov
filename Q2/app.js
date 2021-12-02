const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const { UserModel } = require("./usermodel");

const app = express();
const port = 8000;

app.set("view engine", "ejs");
app.set("trust proxy", 1);
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  UserModel.findById(id, function (err, user) {
    done(err, user);
  });
});
passport.use(
  new localStrategy(function (username, password, done) {
    console.log("password", username, password);
    UserModel.findOne({ email: username }, function (err, user) {
      console.log(user);
      if (err) return done(err);
      if (!user) return done(null, false, { message: "Incorrect username." });

      bcrypt.compare(password, user.password, function (err, res) {
        if (err) return done(err);
        if (res === false)
          return done(null, false, { message: "Incorrect password." });

        return done(null, user);
      });
    });
  })
);
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/sucess",(req,res)=>{
  res.render("Sucess",{user:req.user})
})

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/signup" }),
  function (req, res) {
    res.redirect("/sucess");
  }
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
