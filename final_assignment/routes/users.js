const express = require("express");
const router = express.Router();
const User = require("../models/user");
const UserActivity = require("../models/userActivity");
const auth = require("../utils/auth");
require("dotenv").config();
/* user signup. */
router.post("/signup", async (req, res, next) => {
  try {
    const { firstName, lastName, username, password } = req.body;
    const user = new User({ firstName, lastName, username, password });
    await user.save();
    return res.status(401).send({ user });
  } catch (error) {
    return res.status(400).send({});
  }
});

/* user signin. */
router.post("/signin", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const { error, user } = await User.authenticate(username, password);

    if (error) {
      return res.status(401).send({ status: false, message: error });
    }
    const token = await user.generateJWTToken();

    // store user activity
    const userIp = req.get("x-forwarded-for") || req.connection.remoteAddress;
    const userUa = req.get("User-Agent");
    UserActivity.storeUserActivity(userIp, userUa, user);

    return res.status(200).send({ user, token });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error });
  }
});

/* get user by id*/
router.get("/:id", auth, (req, res) => {
  return res.status(200).send(req.user);
});

/* get all user*/
router.get("/", auth, async (req, res) => {
  return res.status(200).send({
    status: true,
    data: await User.getAllUsers(),
  });
});

/* update user by id */
router.put("/:id", auth, async (req, res) => {
  try {
    const { error, user } = await User.updateUser(req.params.id, req.body);
    if (error) {
      throw new Error(error);
    }
    return res.status(200).send({ status: true, user: user });
  } catch (error) {
    return res.status(400).send({ status: false, message: error.message });
  }
});

/* get user list who do not login since last 5 days*/
router.get("/list/lessactive", auth, async (req, res) => {
  try {
    const dateToCheck = new Date();
    dateToCheck.setDate(
      dateToCheck.getDate() - process.env.LEASS_ACTIVE_USER_DAYS
    );

    const userActivity = await UserActivity.aggregate([
      { $match: { date: { $lt: dateToCheck } } },

      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userdata",
        },
      },

      { $unwind: { path: "$userdata" } },
      {
        $project: {
          date: 1,
          "userdata.firstName": 1,
          "userdata.lastName": 1,
          user_id: "$userdata._id",
        },
      },
      {
        $group: {
          _id: {
            user_id: "$user_id",
            first_name: "$userdata.firstName",
            last_name: "$userdata.lastName",
          },
        },
      },
    ]);

    const userList = userActivity.map((user) => ({
      _id: user._id.user_id.toString(),
      userName: user._id.first_name + " " + user._id.last_name,
    }));
    return res.status(200).send({ status: true, data: userList });
  } catch (error) {
    return res.status(400).send({ status: false, message: error.message });
  }
});
module.exports = router;
