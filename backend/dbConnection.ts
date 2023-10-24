import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import * as crypto from 'crypto';
import {Constants} from "./constants";
import { Request, Response } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { decrypt, encrypt } from "./util";

async function ConnectToDB(req: Request<{}, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>, number>) {
  try {
    // const iv = Buffer.from('iv-10-iv');
    // const key = crypto.createHash('sha256').update(String(req.body.key)).digest('base64').substr(0, 32);
    
    // var cipher = crypto.createCipheriv(req.body.algorithm, key, iv);
    // const encrypted = Buffer.concat([cipher.update("mongodb+srv://test:<password>@cluster0.qtltoug.mongodb.net/?retryWrites=true&w=majority"), cipher.final()]).toString('hex');
    // var decipher = crypto.createDecipheriv(req.body.algorithm, key, iv);
    // var decryptedConnectionStr = "";
    // decipher.on('readable', () => {
    //   let chunk;
    //   while (null !== (chunk = decipher.read())) {
    //     decryptedConnectionStr += chunk.toString('utf8');
    //   }
    // });;
    // decipher.write(encrypted, 'base64');

    const decryptedConnectionStr = decrypt(Constants.DB_CONNECTION_STRING, req.body.key, req.body.algorithm);

    await mongoose
      .connect(decryptedConnectionStr)
      .catch((error) => {
        console.log("Error connecting to db: " + error);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ msg: "DB Connection failed" });
      })
      .then(() => {
        console.log("DB Connected Successfully!!");
        res.status(StatusCodes.OK).send({ msg: "DB Connection successful" });
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

export { ConnectToDB, IsDBConnected };
