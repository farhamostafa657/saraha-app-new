import { compare, hash } from "../../Utils/hashing/hash.js";
import * as dbService from "../../DB/dbService.js";
import { roles, userModel } from "../../DB/models/user.model.js";
import { asyncHandler } from "../../Utils/asyncHandler.js";
import { decrypt, encrypt } from "../../Utils/encryption/encryption.js";
import { emailEvent } from "../../Utils/events/events.utils.js";
import { successResponse } from "../../Utils/successResponse.js";
import { logOutEnum, verifyToken } from "../../Utils/token/token.js";
import { tokenModel } from "../../DB/models/token.model.js";

export const getSingleUser = async (req, res, next) => {
  req.user.phone = decrypt(req.user.phone);

  return successResponse({
    res,
    statusCode: 200,
    message: "user fetched successfully",
    data: { user: req.user },
  });
};

export const shareProfile = async (req, res, next) => {
  const { userId } = req.params;

  const user = await dbService.findOne({
    model: userModel,
    filter: { _id: userId, confirmEmail: { $exists: true } },
  });
  if (!user) return next(new Error("User Not Found", { cause: 400 }));

  return successResponse({
    res,
    statusCode: 200,
    message: "User Founded",
    data: user,
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.phone) req.user.phone = await encrypt(req.user.phone);

  const updateUser = await dbService.findOneAndUpdate({
    model: userModel,
    filter: { _id: req.user._id },
    data: req.body,
  });

  return updateUser
    ? successResponse({
        res,
        statusCode: 200,
        message: "User Updated Successfully",
        data: updateUser,
      })
    : next(new Error("Invalid Account ", { cause: 404 }));
};

export const freezeAccount = async (req, res, next) => {
  const { userId } = req.params;

  if (userId && req.user.role != roles.admin)
    return next(
      new Error("You Are Not Authorized To Freeze This Account", { cause: 403 })
    );

  const freezedUser = await dbService.findOneAndUpdate({
    model: userModel,
    filter: { _id: userId || req.user._id, deletedBy: { $exists: false } },
    data: {
      deletedAt: Date.now(),
      deletedBy: req.user._id,
      $unset: {
        restoredAt: true,
        restoredBy: true,
      },
    },
  });

  return freezedUser
    ? successResponse({
        res,
        statusCode: 200,
        message: "User Freezed Successfully",
        data: updateUser,
      })
    : next(new Error("Invalid Account ", { cause: 404 }));
};

export const adminRestoreAccount = async (req, res, next) => {
  const { userId } = req.params;
  const updateUser = await dbService.findOneAndUpdate({
    model: userModel,
    filter: {
      _id: userId,
      deletedBy: { $ne: userId },
    },
    data: {
      $unset: {
        deletedAt: true,
        deletedBy: true,
      },
      restoredAt: Date.now(),
      restoredBy: req.user._id,
    },
  });

  return updateUser
    ? successResponse({
        res,
        statusCode: 200,
        message: "Admen Restore Account Successfully",
        data: updateUser,
      })
    : next(new Error("Invalid User ", { cause: 400 }));
};

export const userRestoreAccount = async (req, res, next) => {
  const updateUser = await dbService.findOneAndUpdate({
    model: userModel,
    filter: {
      _id: req.user._id,
      deletedBy: { $eq: req.user._id },
    },
    data: {
      $unset: {
        deletedAt: true,
        deletedBy: true,
      },
      restoredAt: Date.now(),
      restoredBy: req.user._id,
    },
  });

  return updateUser
    ? successResponse({
        res,
        statusCode: 200,
        message: "User Restore Account Successfully",
        data: updateUser,
      })
    : next(new Error("Invalid User ", { cause: 400 }));
};

export const adminHardDelete = async (req, res, next) => {
  const { userId } = req.params;
  const deletedUser = await dbService.deleteOne({
    model: userModel,
    filter: {
      _id: userId,
      deletedBy: { $exists: true },
    },
  });

  return deletedUser
    ? successResponse({
        res,
        statusCode: 200,
        message: " Account Deleted Successfully",
        data: deletedUser,
      })
    : next(new Error("Invalid Account ", { cause: 400 }));
};

export const updatePassword = async (req, res, next) => {
  const { oldPassword, password, flag } = req.body;

  const mycompare = await compare({
    plainText: oldPassword,
    hash: req.user.password,
  });

  if (!mycompare)
    return next(new Error("Invalid Old Password", { cause: 400 }));

  let updatedDate = {};
  switch (flag) {
    case logOutEnum.logOutFromAllDivices:
      updatedDate.changeCredentialsTime = Date.now();
      break;
    case logOutEnum.logout:
      await dbService.create({
        model: tokenModel,
        data: [
          {
            jti: req.decoded.jti,
            userId: req.user._id,
            expiteIn: Date.now() - req.decoded.iat,
          },
        ],
      });
      break;
    default:
      break;
  }

  const updated = await dbService.updateOne({
    model: userModel,
    filter: { _id: req.user._id },
    data: {
      password: await hash({ plainText: password }),
      ...updatedDate,
    },
  });

  return updated
    ? successResponse({
        res,
        statusCode: 200,
        message: " Paasword Updated Successfully",
        data: updated,
      })
    : next(new Error("Invalid Account", { cause: 400 }));
};

export const profileImage = async (req, res, next) => {
  successResponse({
    res,
    statusCode: 200,
    message: " Paasword Updated Successfully",
    data: req.file,
  });
};
