import User from "./model/user";
import mongoose from "mongoose";
import { ReturnType } from "./constants";
import * as crypto from "crypto";

export const getUserFromDB = async (username: string) => {
  const userFromDB = await User.findOne({}).where({ name: username });

  return userFromDB;
};

export const addUserToDB = async (user: { name: string; password: string }) => {
  let ret = ReturnType.SUCCESS;
  let msg = "";
  try {
    const userFromDB = await getUserFromDB(user.name);
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

export const deleteUser = async (user: { name: string; password: string }) => {
  let ret = ReturnType.SUCCESS;
  try {
    const userFromDB = await getUserFromDB(user.name);
    if (userFromDB) {
      await User.deleteOne({ name: user.name }).catch((error) => {
        console.log(error);
        ret = ReturnType.FAIL;
      });
    } else {
      ret = ReturnType.NOT_FOUND;
    }
  } catch (error) {
    console.log(error);
    ret = ReturnType.FAIL;
  }
  return ret;
};

export const updatePassword = async (user: any, newPassword: string) => {
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

export function encrypt(text: string, key: string, algorithm: string) {
  const iv = Buffer.from("iv-10-iviv-19-iv");
  key = crypto
    .createHash("sha256")
    .update(key)
    .digest("base64")
    .substring(0, 32);
  let cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

export function decrypt(encryptedData: string, key: string, algorithm: string) {
  const iv = Buffer.from("iv-10-iviv-19-iv");
  key = crypto
    .createHash("sha256")
    .update(key)
    .digest("base64")
    .substring(0, 32);
  let encryptedText = Buffer.from(encryptedData, "hex");

  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}
