var express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/users");

var router = express.Router();

/* GET users listing. */
router.get("/", async function (req, res, next) {
  const username = req.user.firstName;
  const users = await User.find();
  res.render("users", { users, username });
});

/* CREATE new user */
router.post("/", async (req, res) => {
  try {
    const user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.userName = req.body.userName;
    user.password = await bcrypt.hash(req.body.password, 10);
    user.age = req.body.age;
    user.isActive = req.body.isActive;
    await user.save();
    res.redirect("/login");
  } catch (e) {
    console.log("faield to add new record", e);
    req.flash("user", "Faield to save user!");
    res.redirect("/");
  }
});

module.exports = router;
