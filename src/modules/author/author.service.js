import mongoose from "mongoose";
import { UserModel } from "../../DB/model/user.model.js";
import { create, createOne, findOne } from "../../common/repository/index.js";
import {
  BadExeception,
  ConflictExeception,
  NotfoundExeception,
} from "../../common/exceptions/index.js";
import { compare, createLoginCredentials, hash } from "../../common/security/index.js";
import { WEB_CLIENT_IDS } from "../../config.js";
import {OAuth2Client} from'google-auth-library';
import { ProviderEnum } from './../../common/enum/user.enum.js';

const client = new OAuth2Client();
async function verifyGoogleAccount(idToken) {
  const ticket = await client.verifyIdToken({
      idToken ,
      audience: WEB_CLIENT_IDS,  // Specify the WEB_CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  // This ID is unique to each Google Account, making it suitable for use as a primary key
  // during account lookup. Email is not a good choice because it can be changed by the user.
  if (!payload.email_verified) {
      throw BadExeception("Email NOt Verified")
   }
  return payload
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



export const signupWithGmail = async ({ idToken} , issuer) => {
   console.log({idToken});
   const {name,email,picture} = await verifyGoogleAccount(idToken)
   console.log({name,email,picture});
   
   const existAccount=await findOne({
    model: UserModel,
    filter :{email}
   })
   if (existAccount) {
    if (existAccount.provider != ProviderEnum.GOOGLE) {
      throw ConflictExeception("Invalid account provider")
    }
    
    return {status:200, data: await createLoginCredentials({user: existAccount , issuer})}
   }
   
   const user = await createOne({
    model:UserModel,
    date:{
      username:name,
      email,
      confirmEmail: new Date(),
      provider: ProviderEnum.GOOGLE,
      image: picture
    }
   })
  return {status:201, data: await createLoginCredentials({user , issuer})} ;
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
  return user;
};

export const login = async ({ email, password }, issuer) => {
  console.log({email,password})
  const accont = await findOne({
    model: UserModel,
    filter: {
      email,
      provider:ProviderEnum.SYSTEM
    },
  });

  if (!accont) {
    throw NotfoundExeception("Invalid Login Data");
  }

  const match = await compare(password, accont.password);

  if (!match) {
    throw NotfoundExeception("Not Exist");
  }


  return await createLoginCredentials({user:accont , issuer})
};

