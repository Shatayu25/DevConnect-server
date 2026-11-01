// connection to the cluster
const mongoose = require("mongoose");
const dns = require("dns");

// written the solve error with dns lookup
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  await mongoose.connect(
    // database connection url  (DevConnect written here refers to the db named as database, if not mentioned then a cluster will be created which comprises of several db's)
    process.env.MONGO_URI,
  );
};

module.exports = connectDB;
