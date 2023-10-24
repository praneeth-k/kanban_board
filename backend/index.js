const express = require("express");
const mongoose = require("mongoose");

const { constants } = require("./constants.js");

const app = express();
app.use(express.json());

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
