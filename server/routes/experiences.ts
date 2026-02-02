import express from "express";
import { Experience } from "../models/Experience";
import { authenticateAdmin } from "../middleware/authAdmin";

const router = express.Router();

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
    const { company, position, startDate, endDate, description } = req.body;

    // Basic validation
    if (!company || !position || !startDate || !description) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    const experience = new Experience({
      company,
      position,
      startDate,
      endDate,
      description,
    });

    await experience.save();
    res.status(201).json(experience);
  } catch (error) {
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
    const { company, position, startDate, endDate, description } = req.body;

    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      {
        company,
        position,
        startDate,
        endDate,
        description,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!experience) {
      return res.status(404).json({ error: "Expérience non trouvée" });
    }

    res.json(experience);
  } catch (error) {
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