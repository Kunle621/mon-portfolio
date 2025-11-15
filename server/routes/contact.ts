import express from "express";
import { Contact } from "../models/Contact.js";

const router = express.Router();

// POST /api/contact (formulaire de contact)
router.post("/", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ message: "Message envoyé avec succès" });
  } catch (error) {
    res.status(400).json({ error: "Erreur envoi message" });
  }
});

export { router as contactRoutes };