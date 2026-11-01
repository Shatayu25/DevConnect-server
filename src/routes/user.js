const express = require("express");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

const USER_SAFE_DATA = "firstName lastName age about skills gender photoUrl";

// get all the pending requests for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // database query
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // Above and below both ways are acceptable.
    // }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      let connectedUser;
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        connectedUser = row.toUserId;
      } else {
        connectedUser = row.fromUserId;
      }

      return {
        ...connectedUser.toObject(),
        connectionId: row._id,
      };
    });

    res.json({
      data,
    });
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    // to avoid duplicates
    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(404).send("ERROR:" + err.message);
  }
});

userRouter.delete("/user/connection/:id/remove", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const id = req.params.id;

    // validation check for authenticated user
    const deletedConnection = await ConnectionRequest.findOneAndDelete({
      _id: id,
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    });

    if (!deletedConnection) {
      return res.status(404).json({
        message:
          "Connection not found or you don't have permission to remove it",
      });
    }

    res.json({
      message: "Connection removed successfully",
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = userRouter;
