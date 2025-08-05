import jwt from "jsonwebtoken";

export const signToken = ({
  payload = {},
  signature = "secret",
  options = {
    expiresIn: "1d",
  },
}) => {
  return jwt.sign(payload, signature, options);
};

export const verifyToken = (token = "", signature = "secret") => {
  return jwt.verify(token, signature);
};
