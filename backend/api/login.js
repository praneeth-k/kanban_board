const { StatusCodes } = require("http-status-codes");
const { getUserFromDB } = require("../../util");
const bcrypt = require("bcrypt");

async function Login(req, res) {
  if (req.body.name && req.body.password) {
    const userFromDB = await getUserFromDB(req.body.name);
    if (userFromDB && userFromDB.name && userFromDB.password) {
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        userFromDB.password
      );
      if (passwordMatch) {
        res.statusCode = StatusCodes.OK;
        res.send({ msg: "Login Success!!", user: userFromDB });
      } else {
        res.statusCode = StatusCodes.UNAUTHORIZED;
        res.send({ msg: "Incorrect password!!" });
      }
    } else {
      res.statusCode = StatusCodes.NOT_FOUND;
      res.send({ msg: "User Not Found" });
    }
  } else {
    res.statusCode = StatusCodes.BAD_REQUEST; //Bad request
    res.send({ msg: "Please send valid UserName/Password" });
  }
}

module.exports = Login;
