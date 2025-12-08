import express from "express";
import { Project } from "../models/Project"; // Enlève le .js si tu utilises ts-node/tsx standard
import { authenticateAdmin } from "../middleware/authAdmin";

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

export { router as projectRoutes };