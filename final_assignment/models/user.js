const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: {
    type: [
      {
        token: String,
      },
    ],
  },
});

userSchema.methods.toJSON = function () {
  const user = this;
  const newuser = user.toObject();
  delete newuser.tokens;
  delete newuser.password;
  return newuser;
};

// update user by id
userSchema.statics.updateUser = async function (id, payload) {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error("User not exist");
    }
    for (const key in payload) {
      if (Object.hasOwnProperty.call(payload, key)) {
        user[key] = payload[key] ? payload[key] : user[key];
      }
    }
    await user.save();
    return { error: null, user: user };
  } catch (error) {
    return { error: error.message, user: null };
  }
};

// authenticat user by credentials
userSchema.statics.getAllUsers = async function () {
  try {
    const user = await User.find();
    return user;
  } catch (error) {
    return [];
  }
};

// authenticat user by credentials
userSchema.statics.authenticate = async function (username, password) {
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return { error: "Invalid credentials", user: null };
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return { error: "Invalid credentials", user: null };
    }
    return { error: null, user: user };
  } catch (error) {
    console.log(error);
  }
};

// generate JWT token for user
userSchema.methods.generateJWTToken = async function () {
  try {
    const user = this;
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
  } catch (error) {
    console.log(error);
  }
};

// encrypt password before save
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
