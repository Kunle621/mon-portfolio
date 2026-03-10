import express from "express";
import { Experience } from "../models/Experience";
import { authenticateAdmin } from "../middleware/authAdmin";
import { z } from "zod";

const router = express.Router();

const experienceSchema = z.object({
  position: z.string().min(2, "Le poste doit contenir au moins 2 caractères"),
  company: z.string().min(2, "L'entreprise doit contenir au moins 2 caractères"),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().optional(),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
});

/**
 * GET /api/experiences (Public)
 * Retrieve all experiences, sorted by start date descending
 */
router.get("/", async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ startDate: -1 });
    res.json(experiences);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur serveur inconnue";
    res.status(500).json({ error: message });
  }
});

/**
 * POST /api/experiences (Admin)
 * Create a new experience
 */
router.post("/", authenticateAdmin, async (req, res) => {
  try {
    const validatedData = experienceSchema.parse(req.body);

    const experience = new Experience({
      ...validatedData,
    });

    await experience.save();
    res.status(201).json(experience);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: (error as any).errors[0].message });
    }
    const message = error instanceof Error ? error.message : "Erreur création expérience";
    res.status(400).json({ error: message });
  }
});

/**
 * PUT /api/experiences/:id (Admin)
 * Update an experience
 */
router.put("/:id", authenticateAdmin, async (req, res) => {
  try {
    const validatedData = experienceSchema.parse(req.body);

    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      {
        ...validatedData,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!experience) {
      return res.status(404).json({ error: "Expérience non trouvée" });
    }

    res.json(experience);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: (error as any).errors[0].message });
    }
    const message = error instanceof Error ? error.message : "Erreur mise à jour expérience";
    res.status(400).json({ error: message });
  }
});

/**
 * DELETE /api/experiences/:id (Admin)
 * Delete an experience
 */
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);

    if (!experience) {
      return res.status(404).json({ error: "Expérience non trouvée" });
    }

    res.json({ message: "Expérience supprimée avec succès" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur suppression expérience";
    res.status(500).json({ error: message });
  }
});

export { router as experienceRoutes };