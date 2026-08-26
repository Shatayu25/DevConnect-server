const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
  },
  password: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

// creates a model based on the schema, first argument is the name of the model and second argument is the required schema.
// const User = mongoose.model("User", userSchema);

// module.exports = User;
//  ------------------ or -----------------

module.exports = mongoose.model("User", userSchema);
