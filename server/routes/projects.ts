import express from "express";
import { Project } from "../models/Project"; // Enlève le .js si tu utilises ts-node/tsx standard
import { authenticateAdmin } from "../middleware/authAdmin";
import cloudinary from "../cloudinary";
import { upload } from "../middleware/upload";


const router = express.Router();

// GET /api/projects (Public)
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// POST /api/projects (Admin seulement)
router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: "Erreur création projet" });
  }
});

// DELETE /api/projects/:id (Admin seulement) - NOUVEAU
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Projet supprimé" });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

// --- UPLOAD IMAGE POUR PROJET ---
router.post("/upload-image", authenticateAdmin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Aucun fichier envoyé" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "portfolio/projects",
    });

    res.json({ imageUrl: result.secure_url });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export { router as projectRoutes };