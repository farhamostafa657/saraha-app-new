import * as dbService from "../../DB/dbService.js";
import { userModel } from "../../DB/models/user.model.js";
import { decrypt } from "../../Utils/encryption.js";
import { successResponse } from "../../Utils/successResponse.js";
import { verifyToken } from "../../Utils/token.js";

export const getSingleUser = async (req, res, next) => {
  req.user.phone = decrypt(req.user.phone);

  return successResponse({
    res,
    statusCode: 200,
    message: "user fetched successfully",
    data: { user: req.user },
  });
};
