import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  titleFr: String,
  titleEn: String,
  descriptionFr: String,
  descriptionEn: String,
  category: String,
  imageUrl: String,
  githubUrl: String,
  demoUrl: String,
  createdAt: { type: Date, default: Date.now },
});

export const Project = mongoose.model("Project", projectSchema);