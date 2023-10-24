const express = require("express");
const mongoose = require("mongoose");

const { constants } = require("./constants.js");
const Login = require("./api/login.js");
const Signin = require("./api/signin.js");

const app = express();
app.use(express.json());

app.post("/login", (req, res) => {
  Login(req, res);
});

app.post("/signin", (req, res) => {
  Signin(req, res);
});

mongoose
  .connect(constants.DB_CONNECTION_STRING)
  .catch((error) => {
    console.log("Error connecting to db: " + error);
  })
  .then(() => {
    console.log();
    app.listen(3001, () => {
      console.log("Server listening on port 3001");
    });
  });
