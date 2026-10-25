import { Router } from "express";
import { successResponse } from '../../common/utils/response.utils.js'
import { confirmEmail, login, requestForgotPasswordCode, resendConfirmEmail, resetForgotPassword, signup, signupWithGmail, verifyForgotPasswordCode } from "./author.service.js";
const router = Router();

import * as validators from './author.validation.js'
import { BadExeception } from "../../common/exceptions/error.exceptions.js";
import { validation } from "../../middleware/validation.middleware.js";



router.post("/login-with-gmail", async (req, res,next) => {
  const {status,data} = await signupWithGmail(req.body, `${req.protocol}://${req.host}`);
  return successResponse({ res, status, data });
});

router.post("/signup",validation(validators.signup), async (req, res,next) => {

  console.log({z:req.validate})

  const data = await signup(req.body );
  return successResponse({ res, status: 201, data });

});
router.patch("/confirm-email",validation(validators.confirmEmail), async (req, res,next) => {

  console.log({z:req.validate})
  const data = await confirmEmail(req.body );
  return successResponse({ res, status: 200, data });

});
router.patch("/resend-confirm-email",validation(validators.resendConfirmEmail), async (req, res,next) => {

  console.log({z:req.validate})
  const data = await resendConfirmEmail(req.body );
  return successResponse({ res, status: 200, data });

});
router.post("/recuest-forgot-password-code",validation(validators.resendConfirmEmail), async (req, res,next) => {

  console.log({z:req.validate})
  const data = await requestForgotPasswordCode(req.body );
  return successResponse({ res, status: 201, data });

});
router.patch("/reset-forgot-password",validation(validators.resetForgotPassword), async (req, res,next) => {

  console.log({z:req.validate})
  const data = await resetForgotPassword(req.body );
  return successResponse({ res, status: 200, data });

});
router.post("/verify-forgot-password",validation(validators.confirmEmail), async (req, res,next) => {

  console.log({z:req.validate})
  const data = await verifyForgotPasswordCode(req.body );
  return successResponse({ res, status: 200, data });

});

router.post("/login",validation(validators.login), async (req, res,next) => {
 
  const data = await login(req.validate.body, `${req.protocol}://${req.host}`);
  return successResponse({ res, status: 201, data });
});




export default router;

