const express = require("express");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  // creating a new instance of the User model
  const user = new User({
    firstName: "Shatayu",
    lastName: "Deshpande",
    emailId: "sd@gmail.com",
    password: "pass123",
  });

  try {
    // saves the user in the db
    await user.save();
    res.send("User created Successfully");
  } catch (err) {
    res.status(400).send("Error saving the user:", err.message);
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
