import { Strategy as LocalStrategy } from "passport-local";
import { UserModel } from "./model";
const passport=require("passport")

// passport.serializeUser(function (user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function (user, done) {
//   done(null, user);
// });

// passport.use(
//   "local-signup",
//   new LocalStrategy(
//     {
//       name: "name",
//       email: "email",
//       password: "password",
//       passReqToCallback: true,
//     },
//     (req, name, email, password, done) => {
//       console.log("Line14", req);
//       if (!req.user) {
//         UserModel.findOne({ name: name }, (err, user) => {
//           if (err) {
//             return done(err);
//           }
//           if (user) {
//             return done(
//               null,
//               false,
//               req.flash("signup-message", "That email is already taken")
//             );
//           }
//           let newUser = new UserModel();
//           newUser.local.email = email;
//           newUser.local.password = newUser.generateHash(password);
//           newUser.save((e) => {
//             if (e) {
//               return done(e);
//             }
//             return done(null, newUser);
//           });
//         });
//       } else {
//         return done(null, req.user);
//       }

//     }
//   )
// );
