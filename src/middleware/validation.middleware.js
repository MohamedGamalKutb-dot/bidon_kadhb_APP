import { LangugeEnum } from "../common/enum/security.enum.js";
import { BadExeception } from "../common/exceptions/error.exceptions.js";

export const validation = (schema) => {
  return (req, res, next) => {
    const lang =Number(req.headers['accept-language']?? LangugeEnum.EN)
    console.log({lang});
    
    const validationResult = schema(lang).safeParse({
      body:req.body,
      query:req.query,
      params:req.params,
    });
    console.log({validationResult});
    

    if (!validationResult.success) {
      throw BadExeception("validation Error", validationResult.error.issues);
    }
    req.validate=validationResult.data
    next();
  };
};
