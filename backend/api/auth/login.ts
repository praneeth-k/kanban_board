import StatusCodes from "http-status-codes";
import { getUserFromDB } from "../../util";
import bcrypt from "bcrypt";
import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";

async function LoginApi(
  req: Request<{}, any, any, ParsedQs, Record<string, any>>,
  res: Response<any, Record<string, any>, number>
) {
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
    res.statusCode = StatusCodes.BAD_REQUEST;
    res.send({ msg: "Please send valid UserName/Password" });
  }
}

export default LoginApi;
