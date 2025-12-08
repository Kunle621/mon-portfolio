import express from "express";
import { Newsletter } from "../models/Newsletter";
import { authenticateAdmin } from "../middleware/authAdmin";

const router = express.Router();

// POST /api/newsletter (Public - Abonnement)
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email déjà abonné" });
    }

    const newsletter = new Newsletter({ email });
    await newsletter.save();
    res.status(201).json({ message: "Abonné avec succès" });
  } catch (error) {
    res.status(400).json({ error: "Erreur abonnement" });
  }
});

// GET /api/newsletter (Admin - Voir liste) - NOUVEAU
router.get("/", authenticateAdmin, async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.json(subscribers);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /api/newsletter/:id (Admin - Supprimer) - NOUVEAU
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.json({ message: "Abonné supprimé" });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export { router as newsletterRoutes };