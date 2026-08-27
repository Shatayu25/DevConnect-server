const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

// will work for all the routes, as not route path is mentioned
//  A middleware provided by express, converts json to js object
app.use(express.json());

app.post("/signup", async (req, res) => {
  // creating a new instance of the User model
  const user = new User(req.body);

  try {
    // saves the user in the db
    await user.save();
    res.send("User created Successfully");
  } catch (err) {
    res.status(400).send("Error saving the user:", err.message);
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
// app.patch("/user", async (req, res) => {
//   const userId = req.body.userId;
//   const data = req.body;

//   try {
//     const user = await User.findByIdAndUpdate(userId, data);
//     res.send("User updated successfully");
//   } catch (err) {
//     res.status(404).send("Something went wrong");
//   }
// });

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
