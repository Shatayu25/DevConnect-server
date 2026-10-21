const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Please login" });
    }

    // standard way of writing, check documentation
    const decodedObj = await jwt.verify(token, "DEV@connect$789");

    const { _id } = decodedObj;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User Not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(404).send("ERROR:" + err.message);
  }
};

module.exports = {
  userAuth,
};
