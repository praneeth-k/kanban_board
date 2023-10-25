import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import * as crypto from "crypto";
import { Constants } from "./constants";
import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { decrypt, encrypt } from "./util";

async function ConnectToDBApi(
  req: Request<{}, any, any, ParsedQs, Record<string, any>>,
  res: Response<any, Record<string, any>, number>
) {
  let ret = true;
  try {
    const decryptedConnectionStr = decrypt(
      Constants.DB_CONNECTION_STRING,
      req.body.key,
      req.body.algorithm
    );

    await mongoose
      .connect(decryptedConnectionStr)
      .catch((error) => {
        console.log("Error connecting to db: " + error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ msg: "DB Connection failed" });
        ret = false;
      })
      .then(() => {
        if (ret) {
          console.log("DB Connected Successfully!!");
          res.status(StatusCodes.OK).send({ msg: "DB Connection successful" });
        }
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

export { ConnectToDBApi, IsDBConnected };
