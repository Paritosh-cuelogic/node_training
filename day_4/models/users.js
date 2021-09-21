const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  age: Number,
  isActive: Boolean,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
