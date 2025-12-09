import mongoose from "mongoose";

const allowedCategories = [
  "web",
  "mobile",
  "deeplearning",
  "datascience",
];

const projectSchema = new mongoose.Schema({
  titleFr: { type: String, default: "" },
  titleEn: { type: String, default: "" },

  descriptionFr: { type: String, default: "" },
  descriptionEn: { type: String, default: "" },

  // Plusieurs catégories possibles, mais seulement celles de l'ENUM
  categories: {
    type: [String],
    enum: allowedCategories,
    default: [],
  },

  imageUrl: { type: String, default: "" },
  githubUrl: { type: String, default: "" },
  demoUrl: { type: String, default: "" },

  createdAt: { type: Date, default: Date.now },
});

export const Project = mongoose.model("Project", projectSchema);
