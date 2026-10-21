// connection to the cluster
const mongoose = require("mongoose");
const dns = require("dns");

// written the solve error with dns lookup
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  await mongoose.connect(
    // database connection url  (DevConnect written here refers to the db named as database, if not mentioned then a cluster will be created which comprises of several db's)
    "mongodb+srv://Shatayu25:shatayu25@cluster0.yapcsfk.mongodb.net/DevConnect?authSource=admin",
  );
};

module.exports = connectDB;
