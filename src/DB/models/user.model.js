import mongoose, { Schema } from "mongoose";

export const genderEnum = {
  male: "male",
  female: "female",
};

export const providers = {
  system: "SYSTEM",
  google: "GOOGLE",
};

export const roles = {
  admin: "ADMIN",
  user: "USER",
};
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "First Name should be at least 3 character"],
      maxLength: [20, "First Name should be at most 20 character"],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Last Name should be at least 3 character"],
      maxLength: [20, "Last Name should be at most 20 character"],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowerCase: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider == providers.system ? true : false;
      },
    },
    confirmEmailOtp: String,
    gender: {
      type: String,
      enum: {
        values: Object.values(genderEnum),
        message: "Gender must be Female or Male",
      },
      default: genderEnum.male,
    },
    forgetPasswordOTP: String,
    changeCredentialsTime: Date,
    deletedAt: Date,
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restoredAt: Date,
    restoredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    phone: String,
    confirmEmail: Date,
    photo: String,
    provider: {
      type: String,
      enum: {
        values: Object.values(providers),
        message: "provider must be either system or google",
      },
    },
    role: {
      type: String,
      enum: {
        values: Object.values(roles),
        message: "role must be ADMIN or USER",
      },
      default: roles.user,
    },
  },
  { timestamps: true }
);

export const userModel =
  mongoose.models.user || mongoose.model("User", userSchema);
