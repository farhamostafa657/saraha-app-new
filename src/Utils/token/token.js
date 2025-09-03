import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { roles } from "../../DB/models/user.model.js";

export const signatureTypeEnum = {
  admin: "ADMIN",
  user: "USER",
};

export const logOutEnum = {
  logOutFromAllDivices: "logOutFromAllDivices",
  logout: "logout",
  stayLoggedIn: "stayLoggedIn",
};

export const signToken = ({
  payload = {},
  signature,
  options = {
    expiresIn: "1d",
  },
}) => {
  return jwt.sign(payload, signature, options);
};

export const verifyToken = (token = "", signature) => {
  return jwt.verify(token, signature);
};

export const getSegnature = async ({
  signatureLevel = signatureTypeEnum.user,
}) => {
  let signature = { accessSignatur: undefined, refreshSignature: undefined };
  switch (signatureLevel) {
    case signatureTypeEnum.admin:
      signature.accessSignatur = process.env.ACCESS_ADMIN_SIGNATURE_TOKEN;
      signature.refreshSignature = process.env.REFRESH_ADMIN_SIGNATURE_TOKEN;
      break;
    case signatureTypeEnum.user:
      signature.accessSignatur = process.env.ACCESS_USER_SIGNATURE_TOKEN;
      signature.refreshSignature = process.env.REFRESH_USER_SIGNATURE_TOKEN;
      break;
    default:
      console.log("Invalid signature level");
      break;
  }

  return signature;
};

export const getNewLoginCredwntials = async (user) => {
  let signature = await getSegnature({
    signatureLevel: user.role == roles.admin ? roles.admin : roles.user,
  });

  const jwtid = nanoid();
  const accessToken = signToken({
    payload: { _id: user._id },
    signature: signature.accessSignatur,
    options: {
      expiresIn: "1d",
      issuer: "Saraha App",
      subject: "Authentication",
      jwtid,
    },
  });

  const refreshToken = signToken({
    payload: { _id: user._id },
    signature: signature.refreshSignature,
    options: {
      expiresIn: "7d",
      issuer: "Saraha App",
      subject: "Authentication",
      jwtid,
    },
  });

  return { accessToken, refreshToken };
};
