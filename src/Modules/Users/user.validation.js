import joi from "joi";
import { generalFields } from "../../Middlewares/validation.middleware.js";
import { logOutEnum } from "../../Utils/token/token.js";

export const shareProfileValidation = {
  params: joi
    .object({
      userId: generalFields.id.required(),
    })
    .required(),
};

export const updateProfileValidation = {
  body: joi.object({
    firstName: generalFields.firstName,
    lastName: generalFields.lastName,
    gender: generalFields.gender,
    role: generalFields.role,
  }),
};

export const freezeAccountValidation = {
  params: joi.object({
    userId: generalFields.id,
  }),
};

export const adminRestoreAccountValidation = {
  params: joi.object({
    userId: generalFields.id,
  }),
};

export const adminHardDeleteValidation = {
  params: joi.object({
    userId: generalFields.id,
  }),
};

export const updatePasswordValidation = {
  body: joi.object({
    oldPassword: generalFields.password.required(),
    password: generalFields.password.not(joi.ref("oldPassword")),
    confirmPassword: generalFields.confirmPassword,
    flag: joi
      .string()
      .valid(...Object.values(logOutEnum))
      .default(logOutEnum.stayLoggedIn),
  }),
};
