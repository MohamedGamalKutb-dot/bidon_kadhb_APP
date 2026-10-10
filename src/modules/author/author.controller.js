import { Router } from "express";
import { successResponse } from '../../common/utils/response.utils.js'
import { login, signup, signupWithGmail } from "./author.service.js";
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

router.post("/login",validation(validators.login), async (req, res,next) => {
 
  const data = await login(req.validate.body, `${req.protocol}://${req.host}`);
  return successResponse({ res, status: 201, data });
});




export default router;

