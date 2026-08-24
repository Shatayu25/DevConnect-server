const express = require("express");

// creating an application of express.js This is like creating a web server.
const app = express();

// this will match the GET method call to /user (this and below are known as route handlers)
app.get("/user", (req, res) => {
  res.send({ fullName: "Shatayu", lastName: "Deshpande" });
});

app.post("/user", (req, res) => {
  // saving data to DB
  res.send("Data saved successfully to the database");
});

app.delete("/user", (req, res) => {
  res.send("Data deleted successfully");
});
// 1st parameter is the route on which the request is handled, function (second parameter) inside use is known as request handler.
// this will match all the HTTP method API calls to /test
app.use("/test", (req, res) => {
  res.send("Hello from the server");
});

// listens the incoming requests.
app.listen(4000, () => {
  console.log("Server is successfully listening on port 3000");
});
