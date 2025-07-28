import mongoose, { Schema } from "mongoose";

export const genderEnum = {
  male: "male",
  female: "female",
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
      required: true,
    },
    gender: {
      type: String,
      enum: {
        values: Object.values(genderEnum),
        message: "Gender must be Female or Male",
      },
      default: genderEnum.male,
    },
    phone: String,
    confirmEmail: Date,
  },
  { timestamps: true }
);

export const userModel =
  mongoose.models.user || mongoose.model("User", userSchema);
