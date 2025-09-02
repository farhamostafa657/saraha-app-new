import jwt from "jsonwebtoken";

export const signatureTypeEnum = {
  admin: "ADMIN",
  user: "USER",
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
