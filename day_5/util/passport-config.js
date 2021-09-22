const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/users");

const localStratagy = (passport) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "userName",
        passwordField: "password",
      },
      (userName, password, done) => {
        User.findOne({ userName: userName }, async (err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, { message: "Incorrect username" });
          }
          if (await bcrypt.compare(password, user.password)) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password" });
          }
        });
      }
    )
  );
  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  });
};

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/login");
};
module.exports = { initializedPassport: localStratagy, isAuthenticated };
