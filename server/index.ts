// server.ts
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { projectRoutes } from "./routes/projects";
import { contactRoutes } from "./routes/contact";
import { newsletterRoutes } from "./routes/newsletter";
import { profileRoutes } from "./routes/profile";
import { serviceRoutes } from "./routes/services";
import { skillRoutes } from "./routes/skills";
import { adminRoutes } from "./routes/admin"; // ✅ ajouté
import { experienceRoutes } from "./routes/experiences"; // ✅ ajouté
import { Admin } from "./models/Admin"; // ✅ ajouté
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Connexion MongoDB
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(async () => {
    console.log("✅ MongoDB connecté");
    await seedAdmin(); // ✅ décommenté
  })
  .catch((err) => console.error("❌ MongoDB erreur:", err));

// Fonction pour créer l'admin au démarrage
async function seedAdmin() {
  const count = await Admin.countDocuments();
  if (count === 0) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);
    const admin = new Admin({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
    });
    await admin.save();
    console.log("🔐 Admin créé:", process.env.ADMIN_EMAIL);
  } else {
    console.log("🔐 Admin existe déjà");
  }
}

// Routes
app.use("/api/projects", projectRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/admin", adminRoutes); 
app.use("/api/profile", profileRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experiences", experienceRoutes); 

// Route de test
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend MongoDB fonctionne !" });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});