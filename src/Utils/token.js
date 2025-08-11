import jwt from "jsonwebtoken";

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
