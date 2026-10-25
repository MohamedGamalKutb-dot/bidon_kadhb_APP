import { UserModel } from "../../DB/model/user.model.js";
import {
  findById,
  findByIdAndUpdate,
} from "../../common/repository/base.repository.js";
import { createLoginCredentials, creatRevokeToken } from "../../common/security/token.security.js";
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from "../../config.js";
import { ConflictExeception } from "../../common/exceptions/error.exceptions.js";
import { del, Keys, set } from "../../common/services/index.js";
import { LogoutEnum } from "../../common/enum/security.enum.js";

export const profile = async (user) => {
  return user;
};

export const update = async (user, data) => {
  const account = await findByIdAndUpdate({
    model: UserModel,
    id: user._id,
    update: data,
  });
  return account;
};

export const rotateToken = async (payload, user, issuer) => {
  const accessExpiresIn = (payload.iat + ACCESS_TOKEN_EXPIRES_IN) * 1000;
  const currentTime = Date.now() + 48 * 60000;
  if (currentTime < accessExpiresIn) {
    throw ConflictExeception(
      "sorry we cannot create new login credentials while curennt access token still within valid time range",
    );
  }
  const data = await createLoginCredentials({ user, issuer });
  await creatRevokeToken({ payload });
  return data;
};

export const logout = async (payload, user, { action = LogoutEnum.DEVICE }) => {
  switch (action) {
    case LogoutEnum.ALL:
      user.changeCredentialsTime = new Date();
      await user.save();
      await del({
        Key: await Keys({
          prefix: userBaseRevokeTokenKey({ userId: payload.sub }),
        }),
      });
      break;

    default:
      await creatRevokeToken({ payload });
      break;
  }
  return;
};

export const deleteUser = async ({ userId }) => {
  const user = await UserModel.updateOne({ _id: userId });
  return user;
};

export const getUser = async (inputs) => {
  console.log(inputs);
  const user = await UserModel.findById(inputs);
  return user;
};
