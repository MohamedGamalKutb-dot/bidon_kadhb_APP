import { z } from "zod";
import { generalValidationFields } from "../../common/validation.js";

export const loginSchema = (lang)=>{
  return z.strictObject({
  email: generalValidationFields.email(lang),
  password: generalValidationFields.password(lang),
})
}

export const login = (lang)=>{
  return z.object({
    body:loginSchema(lang),
   
})
};

export const signup =(lang)=>{
  return  z.object({
   body: loginSchema(lang).safeExtend({
    username: generalValidationFields.username(lang),
    phone: generalValidationFields.phone(lang),
    confirmpassword: generalValidationFields.password(lang),
  })
  .superRefine((data, ctx) => {
    generalValidationFields.matchFields({original:"password",copy:"confirmpassword",data,ctx})

    if (!data.username.includes(" ")) {
      ctx.addIssue({
        code: "custom",
        path: ["username"],
        message: "username must contain 2 parts",
      });
    }
  })

})
}
// .refine((data)=>{
//  return data.password == data.confirmpassword
// },{message: "password mismatch with confirmpassword password"})
