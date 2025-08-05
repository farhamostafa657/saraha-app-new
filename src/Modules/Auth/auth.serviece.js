import { create, findOne } from "../../DB/dbService.js";
import { userModel } from "../../DB/models/user.model.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { encrypt } from "../../Utils/encryption.js";
import { hash, compare } from "../../Utils/hash.js";
import { successResponse } from "../../Utils/successResponse.js";
import { signToken } from "../../Utils/token.js";

export const signUp = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, gender, phone } = req.body;
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
});
