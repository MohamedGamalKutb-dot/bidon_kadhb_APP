import { TokenTypeEnum } from "../common/enum/security.authentication.enum.js";
import { ForbiddenExeception, UnauthorizedExeception } from "../common/exceptions/index.js";
import { decodeToken } from "./../common/security/token.security.js";

export const bearerAuth = async ({req, tokenType=TokenTypeEnum.ACCESS}={}) => {
 const [key, credential] = req.headers["authorization"]?.split(" ") || [];
 const { user, payload } = await decodeToken({authorization: credential, tokenType});
        req.user = user;
        req.payload = payload;
}

export const authentication = (tokenType = TokenTypeEnum.ACCESS) => {
  return async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
      throw UnauthorizedExeception("Unauthorized user");
    }
    const [key, credential] = authorization.split(" ") || [];
    switch (key) {
      case "Basic":
        const data =Buffer.from(credential ,'base64').toString()?.split(":");
        
        break;
      case "Bearer": await bearerAuth({req, tokenType})
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