import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import { decrypt } from "./util";
import "dotenv/config";

async function ConnectToDBApi(req: any, res: any, next: any) {
  let ret = true;
  try {
    if (IsDBConnected()) {
      console.log("DB already connected");
      return;
    }
    if (
      process.env.DB_CONNECTION_STRING &&
      process.env.SECRET_KEY &&
      process.env.ALGORITHM
    ) {
      const decryptedConnectionStr = decrypt(
        process.env.DB_CONNECTION_STRING,
        process.env.SECRET_KEY,
        process.env.ALGORITHM
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
            next();
          }
        });
    } else {
      console.log("Connection strin not found");
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ msg: "Environment keys not found" });
    }
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
