import { Router } from "express";
import * as authServiece from "./auth.serviece.js";
import {
  authentication,
  tokenTypeEnum,
} from "../../Middlewares/authentication.middlewares.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import {
  confirmEmailValidation,
  forgetPasswordValidation,
  loginValidation,
  logOutValidation,
  refreshTokenValidation,
  resetPasswordValidation,
  signUpValidation,
  socialLoginValidation,
} from "./auth.validation.js";

const router = Router();

router.post("/signup", validation(signUpValidation), authServiece.signUp);
router.post("/login", validation(loginValidation), authServiece.login);
router.post(
  "/logout",
  validation(logOutValidation),
  authentication({ tokenType: tokenTypeEnum.access }),
  authServiece.logout
);
router.post(
  "/social-login",
  validation(socialLoginValidation),
  authServiece.loginWithGmail
);
router.get(
  "/refresh-token",
  validation(refreshTokenValidation),
  authentication({ tokenType: tokenTypeEnum.refresh }),
  authServiece.refreshToken
);

router.patch(
  "/confirm-email",
  validation(confirmEmailValidation),
  authServiece.confirmEmailApi
);

router.patch(
  "/resetPassword",
  validation(resetPasswordValidation),
  authServiece.resetPassword
);

export default router;
