import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { StatusCodes } from "http-status-codes";
import { ReturnType } from "../../constants";
import User from "../../model/user";

async function DeleteUserApi(
  req: Request<{}, any, any, ParsedQs, Record<string, any>>,
  res: Response<any, Record<string, any>, number>
) {
  try {
    const [username, password] = req.body;
    let queryStatus = ReturnType.SUCCESS;
    if (username && password) {
      const userFromDB = await User.findOne({}).where({ name: username });
      if (userFromDB) {
        await User.deleteOne({ name: username }).catch((error) => {
          console.log(error);
          queryStatus = ReturnType.FAIL;
        });
      } else {
        queryStatus = ReturnType.NOT_FOUND;
      }
      if ((queryStatus as ReturnType) === (ReturnType.SUCCESS as ReturnType)) {
        res.statusCode = StatusCodes.OK;
        res.send({ msg: "User deleted!!" });
      } else if (
        (queryStatus as ReturnType) === (ReturnType.NOT_FOUND as ReturnType)
      ) {
        res.statusCode = StatusCodes.NOT_FOUND;
        res.send({ msg: "User not found" });
      } else {
        res.statusCode == StatusCodes.INTERNAL_SERVER_ERROR;
        res.send({ msg: "Internal server error" });
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

export default DeleteUserApi;
