import bcrypt  from 'bcrypt';
import { SALT } from '../../config.js';
import  argon2  from 'argon2';

export const hash =async (
    {plaintext,
    salt_round=SALT,
    minor="b",
}={})=>{
  const saltRoundSignature= await bcrypt.genSalt(salt_round,minor);
  const cipherText= await bcrypt.hash(plaintext,saltRoundSignature);
  return cipherText
}

export const compare =async (plaintext,cipherText)=>{
  const match= await bcrypt.compare(plaintext,cipherText)
  return match
}