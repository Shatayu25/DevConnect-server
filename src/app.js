const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const { validateSignUp } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");

const app = express();
const User = require("./models/user");
const bcrypt = require("bcrypt");

// will work for all the routes, as not route path is mentioned
//  A middleware provided by express, converts json to js object
app.use(express.json());
// a middleware used to read to cookie
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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
    res.status(400).send("Error saving the user:", + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
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

// before going to the route handler, the api endpoints pass through the middleware and after the required authentication the response is sent back to the client.
app.post("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(404).send("ERROR: " + err.message);
  }
});

// get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

// delete used by id from the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (err) {
    res.status(404).send("user not found");
  }
});

// update the user by id in the database
app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key),
    );
    if (!isUpdateAllowed) {
      throw new Error("User update is not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills should not be more than 10");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      // checks for the validations when user data is updated.
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

// update the user by email in the database
app.patch("/user", async (req, res) => {
  const emailId = req.body.emailId;
  const data = req.body;

  try {
    const user = await User.findOneAndUpdate({ emailId }, data);
    res.send("User updated successfully");
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

// feed api (will help to get all the users present in the collection of users)
app.use("/feed", async (req, res) => {
  //  {} allows to get all the data
  const users = await User.find({});
  try {
    if (users.length === 0) {
      res.status(404).send("No user was found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(404).send("Something went wrong");
  }
});

// returns a promise
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(4000, () => {
      console.log("Server is successfully listening on port 4000");
    });
  })
  .catch((err) => {
    console.log("Database connection failed:", err.message);
  });
