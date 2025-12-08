import express from "express";
import { Contact } from "../models/Contact";
import { authenticateAdmin } from "../middleware/authAdmin";

const router = express.Router();

// POST /api/contact (Public - Envoi message)
router.post("/", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ message: "Message envoyé avec succès" });
  } catch (error) {
    res.status(400).json({ error: "Erreur envoi message" });
  }
});

// GET /api/contact (Admin - Lire messages) - NOUVEAU
router.get("/", authenticateAdmin, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PATCH /api/contact/:id/read (Admin - Marquer lu) - NOUVEAU
router.patch("/:id/read", authenticateAdmin, async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id, 
      { read: true }, 
      { new: true }
    );
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// DELETE /api/contact/:id (Admin - Supprimer) - NOUVEAU
router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Message supprimé" });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export { router as contactRoutes };