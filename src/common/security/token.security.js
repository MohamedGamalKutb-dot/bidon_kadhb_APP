import jwt from "jsonwebtoken";
import {
  ACCESS_ADMIN_TOKEN_SIGNTURE,
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_USER_TOKEN_SIGNTURE,
  REFRESH_ADMIN_TOKEN_SIGNTURE,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_USER_TOKEN_SIGNTURE,
} from "../../config.js";
import {
  BadExeception,
  NotfoundExeception,
  UnauthorizedExeception,
} from "../exceptions/index.js";
import { UserModel } from "../../DB/model/user.model.js";
import { findById } from "../repository/base.repository.js";
import { TokenTypeEnum } from "../enum/security.authentication.enum.js";
import { RoleEnum } from "../enum/user.enum.js";
import { randomUUID } from "node:crypto";
import { exist, set } from "../services/index.js";

export const userBaseRevokeTokenKey = ({ userId,  }) => {
  return `User::${userId._id.toString()}::Revoke_Token`;
};
export const userRevokeTokenKey = ({ userId, jti }) => {
  return `${userBaseRevokeTokenKey({userId})}::${jti}`;
};

export const createToken = async ({
  payload = {},
  option = {},
  secret = ACCESS_USER_TOKEN_SIGNTURE,
}) => {
  return jwt.sign(payload, secret, option);
};
export const verifyToken = async ({
  token = "",
  secret = ACCESS_USER_TOKEN_SIGNTURE,
}) => {
  return jwt.verify(token, secret);
};

const getTokenSignatures = async ({ role = RoleEnum.USER } = {}) => {
  let signatures;
  switch (role) {
    case RoleEnum.ADMIN:
      signatures = {
        accessSignature: ACCESS_ADMIN_TOKEN_SIGNTURE,
        refreshSignature: REFRESH_ADMIN_TOKEN_SIGNTURE,
      };
      break;

    default:
      signatures = {
        accessSignature: ACCESS_USER_TOKEN_SIGNTURE,
        refreshSignature: REFRESH_USER_TOKEN_SIGNTURE,
      };

      break;
  }
  return signatures;
};

const gitsignature = async ({
  tokenType = TokenTypeEnum.ACCESS,
  role = RoleEnum.USER,
} = {}) => {
  const signatures = await getTokenSignatures({ role });
  return tokenType == TokenTypeEnum.ACCESS
    ? signatures.accessSignature
    : signatures.refreshSignature;
};

export const decodeToken = async ({
  authorization = "",
  tokenType = TokenTypeEnum.ACCESS,
}) => {
  const decoded = jwt.decode(authorization);
  console.log(decoded);
  if (!decoded?.aud?.length) {
    throw BadExeception("missing token payload");
  }

  const payload = await verifyToken({
    token: authorization,
    secret: await gitsignature({ tokenType, role: decoded.aud[0] }),
  });

  if (!payload?.sub) {
    throw BadExeception("missing token payload");
  }
  if (
    await exist({
      Key: userRevokeTokenKey({ userId: payload.sub, jti: payload.jti }),
    })
  ) {
    throw UnauthorizedExeception("Expired login credentials");
  }
  const user = await findById({
    model: UserModel,
    id: payload.sub,
  });
  if (!user) {
    throw NotfoundExeception("invalid user Account");
  }
  if ((user.changeCredentialsTime.getTime() ?? 0) > payload.iat * 1000) {
  }
  return { user, payload };
};

export const createLoginCredentials = async ({
  user,
  issuer,
  options = {},
}) => {
  const { accessSignature, refreshSignature } = await getTokenSignatures({
    role: user.role,
  });
  const jetid = randomUUID();
  const access_token = await createToken({
    payload: { sub: user._id },
    secret: accessSignature,
    option: {
      ...options,
      issuer,
      audience: [user.role],
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      jetid,
    },
  });

  const refresh_token = await createToken({
    payload: { sub: user._id },
    secret: refreshSignature,
    option: {
      ...options,
      issuer,
      audience: [user.role],
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      jetid,
    },
  });

  console.log({ accessSignature, refreshSignature });
  return { access_token, refresh_token };
};

export const creatRevokeToken = async ({ payload }) => {
  console.log(payload, consumedTime, refreshExpiresIn, ttl);
  const consumedTime = (Math.ceil(Date.now() / 1000) - payload.iat) / 60;
  const refreshExpiresIn = payload.iat + REFRESH_TOKEN_EXPIRES_IN;
  const ttl = refreshExpiresIn - consumedTime;
  await set({
    Key: userRevokeTokenKey({ userId: payload.sub, jti: payload.jti }),
    Value: payload.jti,
    ttl,
  });
};
