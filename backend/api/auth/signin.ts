import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { StatusCodes } from "http-status-codes";
import { ReturnType } from "../../constants";
import User from "../../model/user";
import mongoose from "mongoose";
import { LoginUser } from "./login";

const addUserToDB = async (user: { name: string; password: string }) => {
  let ret = ReturnType.SUCCESS;
  let msg = "";
  try {
    const userFromDB = await User.findOne({}).where({ name: user.name });
    if (userFromDB) {
      ret = ReturnType.FAIL;
    } else {
      await User.create({
        name: user.name,
        password: "" + user.password,
      }).catch((err) => {
        console.log(err);
        if (err instanceof mongoose.Error.ValidationError) {
          msg = err.message;
          ret = ReturnType.VALIDATION_ERROR;
        } else {
          ret = ReturnType.FAIL;
        }
      });
    }
  } catch (error) {
    console.log(error);
    ret = ReturnType.FAIL;
  }
  return { ret: ret, msg: msg };
};

async function SigninApi(req: any, res: any) {
  try {
    if (req.body && req.body.name && req.body.password) {
      const queryStatus: { ret: ReturnType; msg: string } = await addUserToDB({
        name: req.body.name,
        password: req.body.password,
      });
      if (
        (queryStatus.ret as ReturnType) === (ReturnType.SUCCESS as ReturnType)
      ) {
        console.log("User Created Successfully. Logging in the user now");
        let errorOccured = false;
        const userFromDB = await User.findOne({})
          .where({ name: req.body.name })
          .catch((error) => {
            console.log(error);
            errorOccured = true;
          });
        if (errorOccured) {
          res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .send("Internal Server Error");
        } else {
          LoginUser(userFromDB, res);
        }
      } else if (
        (queryStatus.ret as ReturnType) ===
        (ReturnType.VALIDATION_ERROR as ReturnType)
      ) {
        res.statusCode = StatusCodes.BAD_REQUEST;
        res.send({ msg: queryStatus.msg });
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

export default SigninApi;
