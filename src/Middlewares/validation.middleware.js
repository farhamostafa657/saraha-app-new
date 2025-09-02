import joi from "joi";
import mongoose from "mongoose";

export const generalFields = {
  firstName: joi.string().min(3).max(20).messages({
    "string.min": "Firsy name must be at least 3 charchter",
    "string.max": "Firsy name must be at mosst 20 charchter",
    "any.required": "First Name is mendatory",
  }),
  lastName: joi.string().min(3).max(20).messages({
    "string.min": "Firsy name must be at least 3 charchter",
    "string.max": "Firsy name must be at mosst 20 charchter",
    "any.required": "First Name is mendatory",
  }),
  email: joi.string().email({
    minDomainSegments: 2,
    maxDomainSegments: 5,
    tlds: { allow: ["com", "net", "edu", "io", "org"] },
  }),
  password: joi.string().pattern(/^[A-Za-z\d@#*$!]{8,20}$/),
  confirmPassword: joi.ref("password"),
  gender: joi.string().valid("male", "female").default("male"),
  role: joi.string().valid("ADMIN", "USER").default("USER"),
  phone: joi.string().pattern(/^(002|\+2)?01[0125]\d{8}$/),
  id: joi.string().custom((value, helper) => {
    mongoose.Types.ObjectId.isValid(value) |
      helper.message("User Id is Invalid");
  }),
  otp: joi.string().pattern(/\d{6}/),
};

export const validation = (schema) => {
  return (req, res, next) => {
    let validationError = [];
    for (const key of Object.keys(schema)) {
      const validationResult = schema[key].validate(req[key], {
        abortEarly: false,
      });

      if (validationResult.error)
        validationError.push({ key, details: validationResult.error.details });
    }

    if (validationError.length)
      return res
        .status(400)
        .json({ error: "validation error", details: validationError });

    return next();
  };
};
