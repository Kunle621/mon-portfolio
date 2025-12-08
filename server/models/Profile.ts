import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  // Infos de base
  name: { type: String, default: "Mon Nom" },
  titleFr: { type: String, default: "Développeur Web" },
  titleEn: { type: String, default: "Web Developer" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  location: { type: String, default: "" },

  // Images & Fichiers
  headshotUrl: { type: String, default: "" },
  cvUrl: { type: String, default: "" },

  // Bio (À propos)
  bioFr: { type: String, default: "" },
  bioEn: { type: String, default: "" },

  // Liens Sociaux
  githubUrl: { type: String, default: "" },
  linkedinUrl: { type: String, default: "" },
  twitterUrl: { type: String, default: "" },

  // Disponibilité
  availability: { type: String, default: "Currently available for new projects" },
});

export const Profile = mongoose.model("Profile", profileSchema);
