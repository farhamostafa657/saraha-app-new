import { create, findOne } from "../../DB/dbService.js";
import { providers, roles, userModel } from "../../DB/models/user.model.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { encrypt } from "../../Utils/encryption.js";
import { hash, compare } from "../../Utils/hash.js";
import { successResponse } from "../../Utils/successResponse.js";
import { signToken } from "../../Utils/token.js";
import { OAuth2Client } from "google-auth-library";

export const signUp = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, gender, phone, role } =
    req.body;
  if (await findOne({ model: userModel, filter: { email } }))
    return next(new Error("User Already Exist"), { cause: 404 });
  //hash
  const hashPassword = await hash({ plainText: password });
  //encrypt
  const encryptedPhone = encrypt(phone);
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
      },
    ],
  });

  return successResponse({
    res,
    statusCode: 201,
    message: "User Created Successfully",
    data: user,
  });
});

export const login = asyncHandler(async (req, res, next) => {
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
});

async function verifyWithGmail({ idToken }) {
  const client = new OAuth2Client();

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

export const loginWithGmail = asyncHandler(async (req, res, next) => {
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
});
