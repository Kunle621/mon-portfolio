// models/Admin.ts
import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
  email: string;
  password: string;
  otp?: string;          // Nouveau : Code OTP temporaire
  otpExpires?: Date;     // Nouveau : Expiration du code
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

adminSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const Admin = model<IAdmin>("Admin", adminSchema);