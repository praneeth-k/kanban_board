const mongoose = require("mongoose");
const { constants } = require("./constants.js");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");

async function ConnectToDB(req, res) {
  try {
    var decipher = crypto.Decipher(req.body.algorithm, req.body.key);
    var decryptedConnectionStr =
      decipher.update(constants.DB_CONNECTION_STRING, "hex", "utf8") +
      decipher.final("utf8");

    await mongoose
      .connect(decryptedConnectionStr)
      .catch((error) => {
        console.log("Error connecting to db: " + error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ msg: "DB Connection failed" });
      })
      .then(() => {
        console.log("DB Connected Successfully!!");
        res.status(StatusCodes.OK).send({ msg: "DB Connection successful" });
      });
  } catch (error) {
    console.log("Error connecting to db:" + error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send({ msg: "DB Connection failed" });
  }
}

function IsDBConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = { ConnectToDB, IsDBConnected };
