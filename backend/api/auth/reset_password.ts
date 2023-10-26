import StatusCodes from "http-status-codes";
import bcrypt from "bcrypt";
import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { ReturnType } from "../../constants";
import User from "../../model/user";
import mongoose from "mongoose";

const updatePassword = async (user: any, newPassword: string) => {
  let ret = ReturnType.SUCCESS;
  let msg = "";
  try {
    user.password = newPassword;
    await user.save().catch((err: any) => {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        ret = ReturnType.VALIDATION_ERROR;
        msg = err.message;
      } else {
        ret = ReturnType.FAIL;
      }
    });
  } catch (error) {
    console.log(error);
    ret = ReturnType.FAIL;
  }
  return { ret: ret, msg: msg };
};

async function ResetPasswordApi(
  req: Request<{}, any, any, ParsedQs, Record<string, any>>,
  res: Response<any, Record<string, any>, number>
) {
  if (req.body.name && req.body.password) {
    const userFromDB = await User.findOne({ name: req.body.name });
    if (userFromDB && userFromDB.name && userFromDB.password) {
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        userFromDB.password
      );
      if (passwordMatch) {
        if (req.body.password === req.body.new_password) {
          res.status(StatusCodes.BAD_REQUEST).send({
            msg: "Entered passwod is same as existing password. Please enter a different password!!",
          });
        } else {
          const queryStatus = await updatePassword(
            userFromDB,
            req.body.new_password
          );
          if (
            (queryStatus.ret as ReturnType) ===
            (ReturnType.SUCCESS as ReturnType)
          ) {
            res
              .status(StatusCodes.OK)
              .send({ msg: "Password Reset Success!! Please Login" });
          } else if (
            (queryStatus.ret as ReturnType) ===
            (ReturnType.VALIDATION_ERROR as ReturnType)
          ) {
            res.status(StatusCodes.BAD_REQUEST).send({ msg: queryStatus.msg });
          } else {
            res
              .status(StatusCodes.INTERNAL_SERVER_ERROR)
              .send({ msg: "Internal Server Error" });
          }
        }
      } else {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .send({ msg: "Incorrect password!!" });
      }
    } else {
      res.status(StatusCodes.NOT_FOUND).send({ msg: "User Not Found" });
    }
  } else {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ msg: "Please send valid UserName/Password" });
  }
}

export default ResetPasswordApi;
