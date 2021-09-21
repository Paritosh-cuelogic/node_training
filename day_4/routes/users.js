var express = require("express");
const User = require("../models/users");

var router = express.Router();

/* GET users listing. */
router.get("/", async function (req, res, next) {
  const users = await User.find();
  res.render("users", { users });
});

/* CREATE new user */
router.post("/", async (req, res) => {
  try {
    const user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.age = req.body.age;
    user.isActive = req.body.isActive;
    await user.save();
    res.redirect("/users");
  } catch (e) {
    console.log("faield to add new record", e);
    req.flash("user", "Faield to save user!");
    res.redirect("/");
  }
});

module.exports = router;
