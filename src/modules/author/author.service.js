import { UserModel } from "../../DB/model/user.model.js";
import { createOne, findOne } from "../../common/repository/index.js";
import {
  BadExeception,
  ConflictExeception,
  NotfoundExeception,
  TooManyReuestExeception,
} from "../../common/exceptions/index.js";
import {
  compare,
  createLoginCredentials,
  hash,
  userBaseRevokeTokenKey,
} from "../../common/security/index.js";
import { WEB_CLIENT_IDS } from "../../config.js";
import { OAuth2Client } from "google-auth-library";
import { ProviderEnum } from "./../../common/enum/user.enum.js";
import {
  createOtp,
  emailEvent,
  UserEmailKey,
  UserEmailTrailsKey,
} from "../../common/utils/index.js";
import { EmailSubjectEnum } from "../../common/enum/email.enum.js";
import {
  del,
  expire,
  get,
  Keys,
  set,
  ttl,
  incrBy,
} from "../../common/services/cache.services.js";

const client = new OAuth2Client();
async function verifyGoogleAccount(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: WEB_CLIENT_IDS, // Specify the WEB_CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  // This ID is unique to each Google Account, making it suitable for use as a primary key
  // during account lookup. Email is not a good choice because it can be changed by the user.
  if (!payload.email_verified) {
    throw BadExeception("Email NOt Verified");
  }
  return payload;
}

/*
payload: {
    iss: 'https://accounts.google.com',
    azp: '954099868083-q1gvc7tlheneqbi6rbr8kbd9sd84etbt.apps.googleusercontent.com',
    aud: '954099868083-q1gvc7tlheneqbi6rbr8kbd9sd84etbt.apps.googleusercontent.com',
    sub: '118005736685443645540',
    email: 'mohamed.g.kutb@gmail.com',
    email_verified: true,
    nonce: 'not_provided',
    nbf: 1790678614,
    name: 'Mohamed Gamal',
    picture: 'https://lh3.googleusercontent.com/a/ACg8ocLFdYAxGn1EaTE7u2mxZLj1N9L_aXLMy4k4bLOLW7FTP-Jm0Q=s96-c',
    given_name: 'Mohamed',
    family_name: 'Gamal',
    iat: 1790678914,
    exp: 1790682514,
    jti: 'ffa78952b2a7874ef69b03645a8d24e61936d04a'
  }
*/

export const signupWithGmail = async ({ idToken }, issuer) => {
  console.log({ idToken });
  const { name, email, picture } = await verifyGoogleAccount(idToken);
  console.log({ name, email, picture });

  const existAccount = await findOne({
    model: UserModel,
    filter: { email },
  });
  if (existAccount) {
    if (existAccount.provider != ProviderEnum.GOOGLE) {
      throw ConflictExeception("Invalid account provider");
    }

    return {
      status: 200,
      data: await createLoginCredentials({ user: existAccount, issuer }),
    };
  }

  const user = await createOne({
    model: UserModel,
    date: {
      username: name,
      email,
      confirmEmail: new Date(),
      provider: ProviderEnum.GOOGLE,
      image: picture,
    },
  });
  return { status: 201, data: await createLoginCredentials({ user, issuer }) };
};

const sendEmailOtp = async ({
  email,
  subject,
  expiresIn = 120,
  maxTrials = 3,
  blockInSeconds = 300,
  title,
}) => {
  const existOTP_TTL = await ttl({ Key: UserEmailKey({ email, subject }) });
  if (existOTP_TTL > 0) {
    throw ConflictExeception(
      `Sorry we cannot create new otp while existing one still valid please try again later after ${existOTP_TTL}s`,
    );
  }

  const oldTrials =
    (await get({ Key: UserEmailTrailsKey({ email, subject }) })) ?? 0;
  if (oldTrials >= maxTrials) {
    throw TooManyReuestExeception("Many otp trials has been reached");
  }

  const code = createOtp();
  await set({
    Key: UserEmailKey({ email, subject }),
    value: await hash({ plaintext: code.toString() }),
    ttl: expiresIn,
  });

  const currentTrials = await incrBy({
    Key: UserEmailTrailsKey({ email, subject }),
  });

  if (currentTrials == 3) {
    await expire({
      Key: UserEmailTrailsKey({ email, subject }),
      ttl: blockInSeconds,
    });
  }
  emailEvent.emit("sendEmail", {
    recipients: { to: email },
    subject,
    data: { code, title: title ?? subject },
  });
};

export const signup = async ({ username, email, password, phone, gender }) => {
  const duplicatedAccount = await findOne({
    model: UserModel,
    filter: { email },
    options: { select: "email" },
  });

  if (duplicatedAccount) throw ConflictExeception("Email Exist");

  const user = await createOne({
    model: UserModel,
    date: {
      username,
      email,
      password: await hash({ plaintext: password }),
      phone,
      gender,
    },
    options: { validdateBeforeSave: true },
  });

  await sendEmailOtp({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL });
  return user;
};

export const confirmEmail = async ({ otp, email }) => {
  const account = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: false },
    },
  });

  if (!account) throw NotfoundExeception("Invalid account");

  const hashOtp = await get({
    Key: UserEmailKey({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL }),
  });
  if (!hashOtp || !(await compare(otp, hashOtp))) {
    throw ConflictExeception("Invalid OTP");
  }
  account.confirmEmail = new Date();
  await account.save();
  await del({
    Key: await Keys({
      prefix: UserEmailKey({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL }),
    }),
  });
  return;
};
export const resendConfirmEmail = async ({ email }) => {
  const account = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: false },
    },
  });

  if (!account) throw NotfoundExeception("Invalid account");
  await sendEmailOtp({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL });

  return;
};
export const requestForgotPasswordCode = async ({ email }) => {
  const account = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
  });

  if (!account) throw NotfoundExeception("Invalid account");
  await sendEmailOtp({ email, subject: EmailSubjectEnum.FORGOT_PASSWORD });

  return account;
};
export const resetForgotPassword = async ({ otp, email, password }) => {
  const account = await verifyForgotPasswordCode({ otp, email });
  console.log({otp, email ,password});
  
  account.password = await hash({plaintext : password});
  account.changeCredentialsTime = new Date();
  await account.save();
 
  const result = await Promise.all([
    Keys({ prefix: userBaseRevokeTokenKey({ userId: account._id }) }),
    Keys({ prefix: UserEmailKey({
        email,
        subject: EmailSubjectEnum.FORGOT_PASSWORD,
      }),
    }),
  ]);

  const keys = [...result[0], ...result[1]];
  if (keys.length > 0) {
    await del({ Key: keys });
  }

  return account;
};
export const verifyForgotPasswordCode = async ({ otp, email }) => {
  const account = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
  });

  if (!account) throw NotfoundExeception("Invalid account");

  const hashOtp = await get({
    Key: UserEmailKey({ email, subject: EmailSubjectEnum.FORGOT_PASSWORD }),
  });
  if (!hashOtp || !(await compare(otp, hashOtp))) {
    throw ConflictExeception("Invalid OTP");
  }

  return account;
};


export const login = async ({ email, password }, issuer) => {
  console.log({ email, password });
  const accont = await findOne({
    model: UserModel,
    filter: {
      email,
      provider: ProviderEnum.SYSTEM,
      confirmEmail: { $exists: true },
    },
  });

  if (!accont) {
    throw NotfoundExeception("Invalid Login Data");
  }

  const match = await compare(password, accont.password);

  if (!match) {
    throw NotfoundExeception("Not Exist");
  }

  return await createLoginCredentials({ user: accont, issuer });
};
