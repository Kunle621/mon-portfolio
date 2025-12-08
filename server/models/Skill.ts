import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  name: String,
  icon: String, // Nom de l'icône ou URL image
  category: String, // ex: "Frontend", "Backend", "Tools"
  color: String, // Pour le style (ex: "text-blue-500")
});

export const Skill = mongoose.model("Skill", skillSchema);