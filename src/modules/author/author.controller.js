import { Router } from "express";
import { successResponse } from '../../common/utils/response.utils.js'
import { confirmEmail, login, requestForgotPasswordCode, resendConfirmEmail, resetForgotPassword, signup, signupWithGmail, verifyForgotPasswordCode } from "./author.service.js";
const router = Router({caseSensitive:true , strict: true , mergeParams:true});

import * as validators from './author.validation.js'
import { validation } from "../../middleware/validation.middleware.js";
import { del } from "../../common/services/cache.services.js";
import { denerateLimiter } from "../../common/utils/limiter.js";



router.post("/login-with-gmail", async (req, res,next) => {
  const {status,data} = await signupWithGmail(req.body, `${req.protocol}://${req.host}`);
  return successResponse({ res, status, data });
});

router.post("/signup",validation(validators.signup), async (req, res,next) => {

  // console.log({z:req.validate})

  const data = await signup(req.body );
  return successResponse({ res, status: 201, data });

});
router.patch("/confirm-email",validation(validators.confirmEmail), async (req, res,next) => {
  const data = await confirmEmail(req.body );
  return successResponse({ res, status: 200, data });

});
router.patch("/resend-confirm-email",validation(validators.resendConfirmEmail), async (req, res,next) => {
  const data = await resendConfirmEmail(req.body );
  return successResponse({ res, status: 200, data });

});
router.post("/recuest-forgot-password-code",validation(validators.resendConfirmEmail), async (req, res,next) => {
  const data = await requestForgotPasswordCode(req.body );
  return successResponse({ res, status: 201, data });

});
router.patch("/reset-forgot-password",validation(validators.resetForgotPassword), async (req, res,next) => {
  const data = await resetForgotPassword(req.body );
  return successResponse({ res, status: 200, data });

});
router.post("/verify-forgot-password",validation(validators.confirmEmail), async (req, res,next) => {
  const data = await verifyForgotPasswordCode(req.body );
  return successResponse({ res, status: 200, data });

});

const loginLimiter =denerateLimiter({limit:10,ttl:5, skipSuccessfulRequests:true})


router.post("/login", loginLimiter , validation(validators.login), async (req, res,next) => {
  const data = await login(req.validate.body, `${req.protocol}://${req.host}`);
  await del({Key: req.rateLimit.key})
  return successResponse({ res, status: 200, data });
});





export default router;

