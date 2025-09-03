import mongoose, { Schema } from "mongoose";

const tokenSchema = new Schema(
  {
    jti: {
      type: String,
      required: true,
      unique: true,
    },
    expiresIn: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

export const tokenModel =
  mongoose.models.token || mongoose.model("token", tokenSchema);
