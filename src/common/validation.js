import { z } from "zod";
import { GenderEnum } from "./enum/user.enum.js";
import { LangugeEnum } from "./enum/security.enum.js";
import mongoose from "mongoose";

const validationMessages = {
    102: {
        ar: "عفوا لا يمكن ادخل اسم مستخدم اقل من حرفين",
        en: "min length is 2 char",
    }
}

const getValidationMessage = (lang, code) => {
    return lang == LangugeEnum.AR ?
        validationMessages[code].ar : validationMessages[code].en
}



const matchFields=({original,copy,data,lang})=>{
if (data[original] != data[copy]) {
      ctx.addIssue({
        code: "custom",
        path: [copy],
        message: lang==LangugeEnum.AR? `فشل التطابق بين  كلا من${original} and ${copy}`:`Fail to match between ${original} and ${copy}`,
      });
    }
}
export const generalValidationFields = {
  email: (lang)=>z.email({
    message: "invalid email format please add valid email like example@any.com",
  }),
  otp: (lang) => z.string().regex(/^\d{6}$/, {error:"invalid code"}),
  password:(lang)=> z.string().min(8).max(16),

  username: (lang)=>z.string().min(2, 
    { message:lang==LangugeEnum.AR? 
        validationMessages[102].ar : validationMessages[102].en
     }).max(51),
  phone:(lang)=> z.e164(),
  id:(lang)=> z.string().refine((data)=>{return mongoose.Types.ObjectId.isValid(data)},{message: "Invalid format"}),
  files:(lang)=>  z.strictObject({
          fieldname: z.string(),
          originalname: z.string(),
          encoding: z.string(),
          mimetype: z.string(),
          buffer: z.instanceof(Buffer),
          size: z.number(),
          path: z.string(),
        }),
  
  confirmpassword:(lang)=> z.string().min(8).max(16),
  gender:(lang)=> z.enum(GenderEnum),
  matchFields
};
