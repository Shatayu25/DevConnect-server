const express = require("express");
const authRouter = express.Router();

const { validateSignUp } = require("../utils/validation");

const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  // Validation of the data
  validateSignUp(req);

  const { firstName, lastName, emailId, password } = req.body;

  // Encrypting the password
  const passwordHash = await bcrypt.hash(password, 10);

  // creating a new instance of the User model
  const user = new User({
    firstName,
    lastName,
    emailId,
    password: passwordHash,
  });
  try {
    // saves the user in the db
    await user.save();
    res.send("User created Successfully");
  } catch (err) {
    res.status(400).send("Error saving the user:", +err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Create a JWT Token
      // below code is written in userSchema methods to make the code cleaner.
      // const token = await jwt.sign({ _id: user._id }, "DEV@connect$789", {
      //   expiresIn: "1d",
      // });
      const token = await user.getJWT();

      // Add token to the cookie and send response back to the user.
      res.cookie("token", token);
      res.send("User logged-in successfully");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(404).send("ERROR:" + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expiresIn: new Date(Date.now()),
  });
  res.send("Logout successful");
});

module.exports = authRouter;
