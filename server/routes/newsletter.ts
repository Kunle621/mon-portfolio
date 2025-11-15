import express from "express";
import { Newsletter } from "../models/Newsletter.js";

const router = express.Router();

// POST /api/newsletter (abonnement)
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

export { router as newsletterRoutes };