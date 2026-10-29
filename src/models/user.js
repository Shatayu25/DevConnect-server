const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    // field that are stored inside user collection
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address:" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: `{VALUE} is not a valid gender type`,
      },
      // custom validation --> works when 1st time the data is created in the db
      // validate(value) {
      //   if (!["male", "female", "others"].includes(value)) {
      //     throw new Error("Gender data is not valid");
      //   }
      // },
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
    },
    about: {
      type: String,
      default: "This is the default about of the user!",
    },
    skills: {
      // array of strings
      type: [String],
    },
  },
  //  to get the created at and updated at details of the user
  {
    timestamps: true,
  },
);

// helper method (a best practice)
userSchema.methods.getJWT = async function () {
  // points to the instance of the user created when logged-in, hence this is used here
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DEV@connect$789", {
    expiresIn: "1d",
  });

  return token;
};

// helper method (a best practice)
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const passwordCheck = await bcrypt.compare(passwordInputByUser, passwordHash);

  return passwordCheck;
};

// creates a model based on the schema, first argument is the name of the model and second argument is the required schema.
// const User = mongoose.model("User", userSchema);

// module.exports = User;
//  ------------------ or -----------------

module.exports = mongoose.model("User", userSchema);
