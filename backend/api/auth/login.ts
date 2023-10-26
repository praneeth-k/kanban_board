import StatusCodes from "http-status-codes";
import bcrypt from "bcrypt";
import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import User from "../../model/user";
import * as jwt from "jsonwebtoken";
import { ObjectFilter } from "../../util";
import "dotenv/config";
// dotenv.config({ path: "./../../.env" });

async function LoginApi(
  req: Request<{}, any, any, ParsedQs, Record<string, any>>,
  res: Response<any, Record<string, any>, number>
) {
  let errorOccured = false;
  if (req.body.name && req.body.password && process.env.SECRET_KEY) {
    const userFromDB = await User.findOne({})
      .where({ name: req.body.name })
      .catch((error) => {
        errorOccured = true;
        console.log(error);
      });
    if (!errorOccured && userFromDB && userFromDB.name && userFromDB.password) {
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        userFromDB.password
      );
      if (passwordMatch) {
        let token = "";
        if (userFromDB._id) {
          token = jwt.sign(
            { id: userFromDB._id.toString() },
            process.env.SECRET_KEY,
            {
              expiresIn: "10M",
            }
          );
          res.statusCode = StatusCodes.OK;
          res.send({
            msg: "Login Success!!",
            user: ObjectFilter(userFromDB.toJSON(), (key: string) => {
              return !key.startsWith("_") && key != "password";
            }),
            token: token,
          });
        } else {
          res.statusCode = StatusCodes.NOT_FOUND;
          res.send({ msg: "User Not Found" });
        }
      } else {
        res.statusCode = StatusCodes.UNAUTHORIZED;
        res.send({ msg: "Incorrect password!!" });
      }
    } else {
      res.statusCode = StatusCodes.NOT_FOUND;
      res.send({ msg: "User Not Found" });
    }
  } else {
    res.statusCode = StatusCodes.BAD_REQUEST;
    res.send({ msg: "Please send valid UserName/Password" });
  }
}

export default LoginApi;
