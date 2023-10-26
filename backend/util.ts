import User from "./model/user";
import mongoose from "mongoose";
import { ReturnType } from "./constants";
import * as crypto from "crypto";

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
