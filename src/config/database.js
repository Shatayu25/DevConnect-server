// connection to the cluster
const mongoose = require("mongoose");
const dns = require("dns");

// written the solve error with dns lookup 
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://Shatayu25:shatayu25@cluster0.yapcsfk.mongodb.net/?authSource=admin",
  );
};

module.exports = connectDB;
