const express = require("express");

// creating an application of express.js This is like creating a web server. An Express application instance
const app = express();

// // this will match the GET method call to /user (this and below are known as route handlers[the callback containing req and res])
// app.get("/user", (req, res) => {
//   res.send({ fullName: "Shatayu", lastName: "Deshpande" });
// });

// app.post("/user", (req, res) => {
//   // saving data to DB
//   res.send("Data saved successfully to the database");
// });

// app.delete("/user", (req, res) => {
//   res.send("Data deleted successfully");
// });
// // 1st parameter is the route on which the request is handled, function (second parameter) inside use is known as request handler.
// // this will match all the HTTP method API calls to /test
// app.use("/test", (req, res) => {
//   res.send("Hello from the server");
// });

// handles all type of request when .use is written
// app.use(
//   "/user",
//   (req, res, next) => {
//     console.log("Hello from server");
//     res.send("Received");
//     next();
//   },
//   (req, res) => {
//     // res.send("received 2");
//     next();
//   },
//   (req, res) => {
//     // res.send("received 3");
//     next();
//   },
//   (req, res) => {
//     // res.send("received 4");
//     // next()
//   },
// );

// app.get("/admin/getAllData", (req, res) => {
//   // Logic of checking is the request is authorized or not
//   const token = "abc";
//   const isAdminAuthorized = token === "abc";
//   if (isAdminAuthorized) {
//     res.send("You're authorized, All Data sent");
//   } else {
//     res.status(401).send("Unauthorized user");
//   }
// });

// const adminAuth = require("./middlewares/auth");

// // below is the cleaner way of writing a middleware
// app.use("/admin", adminAuth);

// app.get("/admin/getAllData", (req, res) => {
//   res.send("All Data sent");
// });

// app.get("/admin/deleteUser", (req, res) => {
//   res.send("User has been deleted");
// });


// a more better way is to write inside a try catch block
app.use("/getAll Data", (err, req, res, next) => {
  try {
    throw new Error("abc");
    res.send("data sent successfully");
  } catch (err) {
    // res.status(500).send(err.message)
    res.status(500).send("Some error happened, contact to the support team");
  }
});

// middleware example to handle errors, always keep them at the end.
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
});

// listens the incoming requests.
app.listen(4000, () => {
  console.log("Server is successfully listening on port 3000");
});

