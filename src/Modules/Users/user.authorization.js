import { roles } from "../../DB/models/user.model.js";

export const endPoints = {
  getProfile: [roles.user, roles.admin],
  updateProfile: [roles.user, roles.admin],
  freezeAccount: [roles.user, roles.admin],
  adminRestoreAccount: [roles.admin],
  userRestoreAccount: [roles.user],
  adminHardDelete: [roles.admin],
  updatePassword: [roles.user, roles.admin],
};
