import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date }, // Optional for current position
  description: { type: String, required: true }, // HTML content
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Experience = mongoose.model("Experience", experienceSchema);