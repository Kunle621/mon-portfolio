import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  subscribedAt: { type: Date, default: Date.now },
});

// Export ESM correct
export const Newsletter = mongoose.model("Newsletter", newsletterSchema);