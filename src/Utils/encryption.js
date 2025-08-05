import CryptoJS from "crypto-js";

export const encrypt = (plainText) => {
  return CryptoJS.AES.encrypt(plainText, "fjhgikhnfdkins").toString();
};

export const decrypt = (cipherText) => {
  return CryptoJS.AES.decrypt(cipherText, "fjhgikhnfdkins").toString(
    CryptoJS.enc.Utf8
  );
};
