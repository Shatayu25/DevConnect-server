const express = require("express");

const app = express();

app.use("/xyz", (req, res) => {
  res.send("Yes i m listening");
});

app.listen("1234", () => {
  "server is listening successfully";
});
