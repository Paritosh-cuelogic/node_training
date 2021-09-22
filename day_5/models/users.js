const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  userName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: Number,
  isActive: Boolean,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
