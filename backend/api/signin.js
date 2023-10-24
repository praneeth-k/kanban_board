const { addUserToDB } = require("../../util");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");

async function Signin(req, res) {
  try {
    if (req.body && req.body.name && req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      const userAddedToDB = await addUserToDB({
        name: req.body.name,
        password: req.body.password,
      });
      if (userAddedToDB) {
        res.statusCode = StatusCodes.OK;
        res.send({ msg: "User Created Successfylly!! Please Login" });
      } else {
        res.statusCode == StatusCodes.CONFLICT;
        res.send({ msg: "User already exist" });
      }
    } else {
      res.statusCode = StatusCodes.BAD_REQUEST;
      res.send({ msg: "Please send valid UserName/Password" });
    }
  } catch (error) {
    console.log(error);
    res.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    res.send({ msg: "Internal server Error" });
  }
}

module.exports = Signin;
