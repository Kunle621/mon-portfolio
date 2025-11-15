import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { projectRoutes } from "./routes/projects.js";
import { contactRoutes } from "./routes/contact.js";
import { newsletterRoutes } from "./routes/newsletter.js";
import { adminRoutes } from "./routes/admin.js";
import { Admin } from "./models/Admin.js";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI!)
  .then(async () => {
    console.log("✅ MongoDB connecté");

    // Seeder : créer l'admin si aucun admin n'existe
    await seedAdmin();
  })
  .catch(err => console.error("❌ MongoDB erreur:", err));

// Fonction pour créer l'admin
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

// Route de test
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend MongoDB fonctionne !" });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});