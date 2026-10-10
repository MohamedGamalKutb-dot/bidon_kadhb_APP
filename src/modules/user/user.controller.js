import { Router } from "express";
import { successResponse } from '../../common/utils/response.utils.js'
import { deleteUser, getUser, profile, rotateToken, update } from "./user.service.js";
import { authentication, authorization } from "../../middleware/authentication.middleware.js";
import { TokenTypeEnum } from "../../common/enum/security.authentication.enum.js";
import { RoleEnum } from "../../common/enum/user.enum.js";

const router = Router();

router.get("/user",authentication(), async (req, res,next) => {
  const data = await  profile(req.user);
  return successResponse({ res, status: 201, data });
});

router.patch("/user",authentication(),authorization([RoleEnum.USER,RoleEnum.ADMIN]), async (req, res,next) => {
  const data = await  update(req.user,req.body);
  return successResponse({ res, status: 201, data });
});

router.post("/user/rotate_token",authentication(TokenTypeEnum.REFRESH), async (req, res,next) => {
  const data = await  rotateToken(req.payload,req.user,`${req.protocol}://${req.host}`);
  return successResponse({ res, status: 201, data });
});

router.post("/user/logout",authentication(), async (req, res,next) => {
  const data = await  logout(req.payload,req.user, req.body);
  return successResponse({ res, status: 201, data });
});








router.delete("/user/:userId", async (req, res,next) => {
    const data = await deleteUser(req.params);
    return successResponse({ res, status: 201, data });
});


router.get("/user", async (req, res,next) => {
    const {id}=req.query;
  const data = await getUser(id);
  return successResponse({ res, status: 201, data });
});


export default router;