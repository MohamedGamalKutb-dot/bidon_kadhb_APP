import { TokenTypeEnum } from "../common/enum/security.authentication.enum.js";
import { ForbiddenExeception, UnauthorizedExeception } from "../common/exceptions/index.js";
import { decodeToken } from "./../common/security/token.security.js";


export const authentication = (tokenType = TokenTypeEnum.ACCESS) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
      throw UnauthorizedExeception("Unauthorized user");
    }
    const [key, credential] = authorization.split(" ") || [];
    console.log({ key, credential });
    switch (key) {
      case "Basic":
        const data =Buffer.from(credential ,'base64').toString()?.split(":");
        console.log({data});
        
        break;
      case "Bearer":
         const { user, payload } = await decodeToken({
          authorization: credential,
          tokenType,
        });
        req.user = user;
        req.payload = payload;
        break;

      default:
        next(new Error("invalid authenication schema",{cause:{status:400}}))
        break;
    }

    next();
  };
};


export const authorization = (accessRole) => {
  return async (req, res, next) => {

    if (!accessRole.includes(req.user.role)) {
      throw ForbiddenExeception("Forbidden Accont");
    }
    

    next();
  };
};