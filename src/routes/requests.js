const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequests");
const User = require("../models/user");
const { connection } = require("mongoose");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // validation for status coming from the api endpoint
      const allowedStatus = ["interested", "ignored"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type: " + status,
        });
      }

      // validation to check for duplicate connection request, and avoiding two way connection requests.
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request already exists" });
      }

      // validation for checking the user to which the request is sent exists or not
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        res.status(404).json({
          message: "User does not exists",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: "Connection Request sent successfully",
        data,
      });
    } catch (err) {
      res.status(404).send("ERROR:" + err.message);
    }
  },
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" });
      }

      // query to the db
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection Request does not exists" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();
      res.json({ message: "Connection Request " + status, data });
    } catch (err) {
      res.status(404).send("ERROR:" + err.message);
    }
  },
);

module.exports = requestRouter;
