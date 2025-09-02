import bcrypt from "bcryptjs";

export const hash = async ({ plainText = "", salt = +process.env.SALT }) => {
  return await bcrypt.hash(plainText, salt);
};

export const compare = async ({ plainText = "", hash = "" }) => {
  return await bcrypt.compare(plainText, hash);
};
