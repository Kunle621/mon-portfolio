import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  // Infos de base
  name: { type: String, default: "Mon Nom" },
  titleFr: { type: String, default: "Développeur Web" },
  titleEn: { type: String, default: "Web Developer" },
  email: String,
  phone: String,
  location: String,
  
  // Images & Fichiers
  headshotUrl: String,
  cvUrl: String, // Lien vers le PDF

  // Bio (À propos)
  bioFr: String,
  bioEn: String,
  
  // Liens Sociaux
  githubUrl: String,
  linkedinUrl: String,
  twitterUrl: String,
});

export const Profile = mongoose.model("Profile", profileSchema);