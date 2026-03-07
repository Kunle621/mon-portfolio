import express from "express";
import { Project } from "../models/Project";
import { authenticateAdmin } from "../middleware/authAdmin";

const router = express.Router();

/**
 * GET /api/projects (Public)
 * Option : ?category=web
 */
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    let filter: Record<string, any> = {};

    if (category) {
      filter.categories = category;
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur serveur inconnue";
    res.status(500).json({ error: message });
  }
});

/**
 * POST /api/projects (Admin)
 */
router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();

    res.status(201).json(project);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur création projet";
    res.status(400).json({ error: message });
  }
});

/**
 * PUT /api/projects/:id (Admin) -- AJOUTER CETTE ROUTE POUR L'ÉDITION
 */
router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }

    res.json(project);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur mise à jour projet";
    res.status(400).json({ error: message });
  }
});

/**
 * DELETE /api/projects/:id (Admin)
 */
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Projet supprimé" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur lors de la suppression";
    res.status(500).json({ error: message });
  }
});

export { router as projectRoutes };
