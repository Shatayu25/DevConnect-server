const express = require('express');

// creating an application of express.js This is like creating a web server.
const app = express();

// 1st parameter is the route on which the request is handled, function (second parameter) inside use is known as request handler.
app.use("/test", (req, res) => {
  res.send("Hello from the server")
})

// listens the incoming requests.
app.listen(4000, () => {
  console.log("Server is successfully listening on port 3000");
})