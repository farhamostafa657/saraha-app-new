import { Router } from "express";
import * as userService from "./users.serviece.js";
import {
  authentication,
  authorization,
  tokenTypeEnum,
} from "../../Middlewares/authentication.middlewares.js";
import { endPoints } from "./user.authorization.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import {
  adminHardDeleteValidation,
  adminRestoreAccountValidation,
  freezeAccountValidation,
  shareProfileValidation,
  updatePasswordValidation,
  updateProfileValidation,
} from "./user.validation.js";
import { uploadFileLocal } from "../../Utils/multer/multer.utils.js";

const router = Router();

router.get(
  "/getProfile",
  authentication({ tokenType: tokenTypeEnum.access }),
  authorization({ accessRole: endPoints.getProfile }),
  userService.getSingleUser
);

router.get(
  "/:userId/shareProfile",
  validation(shareProfileValidation),
  userService.shareProfile
);

router.patch(
  "/updateProfile",
  validation(updateProfileValidation),
  authentication({ tokenType: tokenTypeEnum.access }),
  authorization({ accessRole: endPoints.updateProfile }),
  userService.updateUser
);

router.delete(
  "/{:userId}/freezeAccount",
  validation(freezeAccountValidation),
  authentication({ tokenType: tokenTypeEnum.access }),
  authorization({ accessRole: endPoints.freezeAccount }),
  userService.freezeAccount
);

router.patch(
  "/:userId/adminRestoreAccount",
  validation(adminRestoreAccountValidation),
  authentication({ tokenType: tokenTypeEnum.access }),
  authorization({ accessRole: endPoints.adminRestoreAccount }),
  userService.adminRestoreAccount
);

router.patch(
  "/userRestoreAccount",
  authentication({ tokenType: tokenTypeEnum.access }),
  authorization({ accessRole: endPoints.userRestoreAccount }),
  userService.userRestoreAccount
);

router.delete(
  "/:userId/adminHardDelete",
  validation(adminHardDeleteValidation),
  authentication({ tokenType: tokenTypeEnum.access }),
  authorization({ accessRole: endPoints.adminHardDelete }),
  userService.adminHardDelete
);

router.patch(
  "/updatePassword",
  validation(updatePasswordValidation),
  authentication({ tokenType: tokenTypeEnum.access }),
  authorization({ accessRole: endPoints.updatePassword }),
  userService.updatePassword
);

router.patch(
  "/profileImage",
  authentication({ tokenType: tokenTypeEnum.access }),
  uploadFileLocal().single("profileImage"),
  userService.profileImage
);

export default router;
