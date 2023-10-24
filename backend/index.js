const express = require("express");
const Login = require("./api/login.js");
const Signin = require("./api/signin.js");
const { ConnectToDB, IsDBConnected } = require("./dbConnection.js");
const { StatusCodes } = require("http-status-codes");

const app = express();
app.use(express.json());
app.use(function (req, res, next) {
  console.log(`Method: ${req.method}, Path: ${req.path}`);
  next();
});

app.use((req, res, next) => {
  const excludePaths = ["/connect_to_db"];
  if (excludePaths.includes(req.path)) {
    next();
  } else {
    if (IsDBConnected()) return next();
    else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ msg: "DB NOT CONNECTED" });
    }
  }
});

app.post("/connect_to_db", (req, res) => {
  ConnectToDB(req, res);
});

app.post("/login", (req, res) => {
  Login(req, res);
});

app.post("/signin", (req, res) => {
  Signin(req, res);
});

app.listen(3001, () => {
  console.log("Server listening on port 3001");
});
