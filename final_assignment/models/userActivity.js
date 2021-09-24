const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema({
  ip: String,
  ua: String,
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

userActivitySchema.statics.storeUserActivity = async function (
  userIp,
  userUa,
  user
) {
  try {
    const userActivity = new UserActivity({
      ip: userIp,
      ua: userUa,
      user: user,
    });
    await userActivity.save();
  } catch (error) {
    console.log(error);
  }
};

const UserActivity = mongoose.model("UserActivity", userActivitySchema);

module.exports = UserActivity;
