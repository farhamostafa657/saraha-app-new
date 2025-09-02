import { userModel } from "../DB/models/user.model.js";
import { getSegnature, verifyToken } from "../Utils/token/token.js";
import * as dbService from "../DB/dbService.js";

export const tokenTypeEnum = {
  access: "access",
  refresh: "refresh",
};

export const decodedToken = async ({
  authorization,
  tokenType = tokenTypeEnum.access,
  next,
}) => {
  const [barear, token] = authorization.split(" ") || [];
  if (!barear || !token) {
    return next(new Error("Invalid token", { cause: 400 }));
  }

  let signature = await getSegnature({ signatureLevel: barear });

  const decoded = verifyToken(
    token,
    tokenType == tokenTypeEnum.access
      ? signature.accessSignatur
      : signature.refreshSignature
  );
  const user = await dbService.findById({
    model: userModel,
    id: { _id: decoded._id },
  });

  if (!user) return next(new Error("User Not Found ", { cause: 404 }));

  return user;
};

export const authentication = ({ tokenType = tokenTypeEnum.access }) => {
  return async (req, res, next) => {
    req.user = await decodedToken({
      authorization: req.headers.authorization,
      tokenType,
      next,
    });

    return next();
  };
};

export const authorization = ({ accessRole = [] }) => {
  return (req, res, next) => {
    if (!accessRole.includes(req.user.role))
      next(new Error("unAuthorized", { cause: 403 }));

    next();
  };
};
