import User from './model/user';
import mongoose from 'mongoose';
import {ReturnType} from './constants';
import * as crypto from 'crypto';

export const getUserFromDB = async (username: string) => {
  const userFromDB = await User.findOne({}).where({ name: username });

  return userFromDB;
};

export const addUserToDB = async (user: {name: string, password: string}) => {
  let ret = ReturnType.SUCCESS;
  try {
    const userFromDB = await getUserFromDB(user.name);
    if (userFromDB) {
      ret = ReturnType.FAIL;
    } else {
      const userCreationStatus = await User.create({
        name: user.name,
        password: "" + user.password,
      }).catch((err) => {
        if(err instanceof mongoose.Error.ValidationError){
          console.log(err);
          ret = ReturnType.VALIDATION_ERROR;
        }
        else{
          console.log(err);
          ret = ReturnType.FAIL;
        }
      });
    }
  } catch (error) {
    console.log(error);
    ret = ReturnType.FAIL;
  }
  return ret;
};

export function encrypt(text:string , key:string, algorithm:string) {
  const iv = Buffer.from('iv-10-iviv-19-iv');
  key = crypto.createHash('sha256').update(key).digest('base64').substring(0, 32);
  let cipher = crypto.createCipheriv(algorithm, key, iv);
  
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
 }
  
 export function decrypt(encryptedData:string , key:string, algorithm:string) {
  const iv = Buffer.from('iv-10-iviv-19-iv');
  key = crypto.createHash('sha256').update(key).digest('base64').substring(0, 32);
  let encryptedText = Buffer.from(encryptedData, 'hex');
  
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString();
 }