const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const flash = require("express-flash-messages");
const cors = require("cors");
const passport = require("passport");
const flask = require("express-flash");
const session = require("express-session");
const User = require("./models/users");

require("dotenv").config();
const passportConfig = require("./util/passport-config");
const isAuthenticated = require("./util/passport-config").isAuthenticated;

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const loginRouter = require("./routes/login");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

passportConfig.initializedPassport(passport);

// parse incomming request and make available in key value pairs
// extended false -> value can be string or array
// extended true -> value can be of any type
app.use(express.urlencoded({ extended: false }));

// parse cookies from header and makes available as req.cookies
app.use(cookieParser());
app.use(flash());
// specify path for static file
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());

// custome routes
app.use("/", indexRouter);
app.use("/users", isAuthenticated, usersRouter);

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/users",
    failureRedirect: "/",
    failureMessage: true,
  })
);
app.use("/login", loginRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
