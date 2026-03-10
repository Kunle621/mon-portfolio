import express from "express";
import { Project } from "../models/Project";
import { authenticateAdmin } from "../middleware/authAdmin";
import { z } from "zod";

const router = express.Router();

const backendProjectSchema = z.object({
  titleFr: z.string().min(1, "Le titre FR est requis"),
  titleEn: z.string().min(1, "Le titre EN est requis"),
  descriptionFr: z.string().min(1, "La description FR est requise"),
  descriptionEn: z.string().min(1, "La description EN est requise"),
  categories: z.array(z.string()).min(1, "Au moins une catégorie est requise"),
  imageUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  demoUrl: z.string().optional(),
});

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
    const validatedData = backendProjectSchema.parse(req.body);
    const project = new Project(validatedData);
    await project.save();

    res.status(201).json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: (error as any).errors[0].message });
    }
    const message = error instanceof Error ? error.message : "Erreur création projet";
    res.status(400).json({ error: message });
  }
});

/**
 * PUT /api/projects/:id (Admin) -- AJOUTER CETTE ROUTE POUR L'ÉDITION
 */
router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const validatedData = backendProjectSchema.parse(req.body);
    
    const project = await Project.findByIdAndUpdate(req.params.id, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }

    res.json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: (error as any).errors[0].message });
    }
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
