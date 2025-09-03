import { userModel } from "../DB/models/user.model.js";
import { getSegnature, verifyToken } from "../Utils/token/token.js";
import * as dbService from "../DB/dbService.js";
import { tokenModel } from "../DB/models/token.model.js";
import { decode } from "jsonwebtoken";

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

  if (
    decoded.jti &&
    (await dbService.findOne({
      model: tokenModel,
      filter: { jti: decoded.jti },
    }))
  )
    return next(new Error("Token Is Revoked", { cause: 401 }));

  const user = await dbService.findById({
    model: userModel,
    id: { _id: decoded._id },
  });

  if (!user) return next(new Error("User Not Found ", { cause: 404 }));

  if (user.changeCredentialsTime?.getTime() > decoded.iat * 1000)
    return next(new Error("Token Expired", { cause: 401 }));

  return { user, decoded };
};

export const authentication = ({ tokenType = tokenTypeEnum.access }) => {
  return async (req, res, next) => {
    const { user, decoded } = await decodedToken({
      authorization: req.headers.authorization,
      tokenType,
      next,
    });
    req.user = user;
    req.decoded = decoded;

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
