import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  // Correction : vérifie que this.password est défini avant de le hasher
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  
  next();
});

export const Admin = mongoose.model("Admin", adminSchema);