import { userModel } from "../../DB/models/user.model.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { successResponse } from "../../Utils/successResponse.js";

export const signUp = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, gender, phone } = req.body;
  if (await userModel.findOne({ email }))
    return next(new Error("User Already Exist"), { cause: 404 });

  const user = await userModel.create({
    firstName,
    lastName,
    email,
    password,
    gender,
    phone,
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
  const user = await userModel.findOne({ email, password });

  if (!user)
    return next(new Error("Invalid email or password"), { cause: 401 });

  return successResponse({
    res,
    statusCode: 200,
    message: "User loged in successfully",
    data: user,
  });
});
