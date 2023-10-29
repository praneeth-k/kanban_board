import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { StatusCodes } from "http-status-codes";
import { ReturnType } from "../../constants";
import User from "../../model/user";
import * as jwt from "jsonwebtoken";

async function DeleteUserApi(
  req: Request<{}, any, any, ParsedQs, Record<string, any>>,
  res: Response<any, Record<string, any>, number>
) {
  try {
    const token = req.body.token;
    let queryStatus = ReturnType.SUCCESS;
    if (token && process.env.SECRET_KEY) {
      const verifiedUser: any = jwt.verify(
        req.body.token,
        process.env.SECRET_KEY
      );
      if (verifiedUser?.id) {
        await User.deleteOne({ _id: verifiedUser.id })
          .catch((error) => {
            console.log(error);
            queryStatus = ReturnType.FAIL;
          })
          .then((res: any) => {
            if (res.deletedCount <= 0) {
              queryStatus = ReturnType.FAIL;
              console.log(res);
            }
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
    if (error instanceof jwt.TokenExpiredError) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ msg: "Session Expired!! Please login again" });
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ msg: "Internal Server Error" });
    }
  }
}

export default DeleteUserApi;
