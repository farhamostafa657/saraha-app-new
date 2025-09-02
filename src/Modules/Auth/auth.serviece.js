import { customAlphabet } from "nanoid";
import {
  create,
  findOne,
  findOneAndUpdate,
  updateOne,
} from "../../DB/dbService.js";
import { providers, roles, userModel } from "../../DB/models/user.model.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { encrypt } from "../../Utils/encryption/encryption.js";
import { hash, compare } from "../../Utils/hashing/hash.js";
import { successResponse } from "../../Utils/successResponse.js";
import { getSegnature, signToken } from "../../Utils/token/token.js";
import { OAuth2Client } from "google-auth-library";
import { emailEvent } from "../../Utils/events/events.utils.js";

export const signUp = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    gender,
    phone,
    role,
    confirmPassword,
  } = req.body;
  if (await findOne({ model: userModel, filter: { email } }))
    return next(new Error("User Already Exist"), { cause: 404 });
  //hash
  const hashPassword = await hash({ plainText: password });
  //encrypt
  const encryptedPhone = encrypt(phone);
  const otp = customAlphabet("0123456789", 6)();
  const hashOtp = await hash({ plainText: otp });
  emailEvent.emit("confirmEmail", {
    to: email,
    firstName,
    otp,
    text: "confirm email",
  });
  const user = await create({
    model: userModel,
    data: [
      {
        firstName,
        lastName,
        email,
        password: hashPassword,
        gender,
        phone: encryptedPhone,
        role,
        confirmEmailOtp: hashOtp,
      },
    ],
  });

  return successResponse({
    res,
    statusCode: 201,
    message: "User Created Successfully",
    data: user,
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findOne({ model: userModel, filter: { email } });

  if (!user)
    return next(new Error("Invalid email or password"), { cause: 401 });

  const isMatch = await compare({ plainText: password, hash: user.password });
  if (!isMatch) return next(new Error("Invalid credentials", { cause: 401 }));

  const accessToken = signToken({
    payload: { _id: user._id },
    signature:
      user.role == roles.admin
        ? process.env.ACCESS_ADMIN_SIGNATURE_TOKEN
        : process.env.ACCESS_USER_SIGNATURE_TOKEN,
    options: {
      expiresIn: "1d",
      issuer: "Saraha App",
      subject: "Authentication",
    },
  });

  const refreshToken = signToken({
    payload: { _id: user._id },
    signature:
      user.role == roles.admin
        ? process.env.REFRESH_ADMIN_SIGNATURE_TOKEN
        : process.env.REFRESH_USER_SIGNATURE_TOKEN,
    options: {
      expiresIn: "7d",
      issuer: "Saraha App",
      subject: "Authentication",
    },
  });
  return successResponse({
    res,
    statusCode: 200,
    message: "User loged in successfully",
    data: { accessToken, refreshToken },
  });
};

async function verifyWithGmail({ idToken }) {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

export const loginWithGmail = async (req, res, next) => {
  const { idToken } = req.body;

  const { email, email_verified, picture, given_name, family_name } =
    await verifyWithGmail({ idToken });

  if (!email_verified)
    return next(new Error("Email not Verefied", { cause: 401 }));

  const user = await findOne({
    model: userModel,
    filter: { email },
  });

  if (user) {
    if (user.provider == providers.google) {
      const accessToken = signToken({
        payload: { _id: user._id },
        options: {
          expiresIn: "1d",
          issuer: "Saraha App",
          subject: "Authentication",
        },
      });

      const refreshToken = signToken({
        payload: { _id: user._id },
        options: {
          expiresIn: "7d",
          issuer: "Saraha App",
          subject: "Authentication",
        },
      });
      return successResponse({
        res,
        statusCode: 200,
        message: "User loged in successfully",
        data: { accessToken, refreshToken },
      });
    }
  }

  const newUser = await create({
    model: userModel,
    data: [
      {
        email,
        firstName: given_name,
        lastName: family_name,
        photo: picture,
        provider: providers.google,
        confirmedEmail: DataTransfer.now,
      },
    ],
  });

  const accessToken = signToken({
    payload: { _id: user._id },
    options: {
      expiresIn: "1d",
      issuer: "Saraha App",
      subject: "Authentication",
    },
  });

  const refreshToken = signToken({
    payload: { _id: newUser._id },
    options: {
      expiresIn: "7d",
      issuer: "Saraha App",
      subject: "Authentication",
    },
  });
  return successResponse({
    res,
    statusCode: 201,
    message: "User created successfully",
    data: { accessToken, refreshToken },
  });
};

export const refreshToken = async (req, res, next) => {
  const user = req.user;
  let signature = await getSegnature({
    signatureLevel: user.role == roles.admin ? roles.admin : roles.user,
  });
  const accessToken = signToken({
    payload: { _id: user._id },
    signature: signature.accessSignatur,
    options: {
      expiresIn: "1d",
      issuer: "Saraha App",
      subject: "Authentication",
    },
  });

  const refreshToken = signToken({
    payload: { _id: user._id },
    signature: signature.refreshSignature,
    options: {
      expiresIn: "7d",
      issuer: "Saraha App",
      subject: "Authentication",
    },
  });
  return successResponse({
    res,
    statusCode: 200,
    message: "New criedential created successfully",
    data: { accessToken, refreshToken },
  });
};

export const confirmEmailApi = async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await findOne({
    model: userModel,
    filter: {
      email,
      confirmEmail: { $exists: false },
      confirmEmailOtp: { $exists: true },
    },
  });

  if (!user)
    next(new Error("email not found or email already exists", { cause: 401 }));
  if (!compare({ plainText: otp, hash: user.confirmEmailOtp }))
    next(new Error("invalid otp", { cause: 401 }));

  const updateUser = await updateOne({
    model: userModel,
    filter: { email },
    data: {
      confirmEmail: Date.now(),
      $unset: { confirmEmailOtp: true },
      $inc: { __v: 1 },
    },
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "email confirmed successfully",
    data: updateUser,
  });
};

export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;

  const otp = customAlphabet("0123456789", 6)();
  const hashOTP = await hash({ plainText: otp });

  const user = await findOneAndUpdate({
    model: userModel,
    filter: {
      email,
      // provider: providers.system,
      confirmEmail: { $exists: true },
      deletedAt: { $exists: false },
    },
    data: { forgetPasswordOTP: hashOTP },
  });

  if (!user)
    return next(new Error("Email Not Found or Not Confirmed ", { cause: 404 }));

  emailEvent.emit("forgetPassword", {
    to: email,
    otp,
    firstName: user.firstName,
  });

  return successResponse({ res, statusCode: 200, message: "Check Your Email" });
};

export const resetPassword = async (req, res, next) => {
  const { email, otp, password } = req.body;

  const user = await findOne({
    model: userModel,
    filter: {
      email,
      //provider: providers.system,
      confirmEmail: { $exists: true },
      deletedAt: { $exists: false },
      forgetPasswordOTP: { $exists: true },
    },
  });

  if (!user)
    return next(new Error("Email Not Found or Not Confirmed ", { cause: 404 }));

  if (!(await compare({ plainText: otp, hash: user.forgetPasswordOTP })))
    return next(new Error("Invalid OTP", { cause: 404 }));

  const hashPassowrd = await hash({ plainText: password });

  const updatedUser = await updateOne({
    model: userModel,
    filter: { email },
    data: {
      password: hashPassowrd,
      $unset: { forgetPasswordOTP: true },
    },
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Password Reset Successfully",
  });
};
