const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();
const auth = async (req, res, next) => {
  try {
    const token = req.get("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).send({ message: "Unautherized" });
  }
};

module.exports = auth;
