const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to the User schema
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignore", "interested", "accepted", "rejected"],
        message: `{VALUE} is not supported`,
      },
    },
  },
  {
    timeStamps: true,
  },
);

// below method will be called before the data is saved in the db. This is a middleware hence next() is used.
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  // Check if the toUserId is same to that of fromUserId
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You cannot send connection request to yourself");
  }
  next();
});

const ConnectionRequest = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = ConnectionRequest;
