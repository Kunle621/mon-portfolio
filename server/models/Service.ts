import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  icon: String, // Nom de l'icône (ex: "Code2", "Database")
  titleFr: String,
  titleEn: String,
  descriptionFr: String,
  descriptionEn: String,
});

export const Service = mongoose.model("Service", serviceSchema);