import express from "express";
import { Contact } from "../models/Contact";
import { authenticateAdmin } from "../middleware/authAdmin";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Configuration Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// POST /api/contact (Public - Envoi message)
router.post("/", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();

    // Envoi automatique d'une réponse
    try {
      await transporter.sendMail({
        from: `"Portfolio Admin" <${process.env.SMTP_USER}>`,
        to: contact.email,
        subject: "Merci pour votre message - Portfolio",
        text: `Bonjour ${contact.name},\n\nMerci d'avoir contacté mon portfolio. J'ai bien reçu votre message :\n\n"${contact.message}"\n\nJe vous répondrai dans les plus brefs délais.\n\nCordialement,\nAmouss Yahya`,
        html: `<p>Bonjour <strong>${contact.name}</strong>,</p>
               <p>Merci d'avoir contacté mon portfolio. J'ai bien reçu votre message :</p>
               <blockquote>"${contact.message}"</blockquote>
               <p>Je vous répondrai dans les plus brefs délais.</p>
               <p>Cordialement,<br>Amouss Yahya</p>`,
      });
      console.log("✅ Réponse automatique envoyée à", contact.email);
    } catch (emailError) {
      console.error("❌ Erreur envoi réponse automatique:", emailError);
    }

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

// POST /api/contact/:id/reply (Admin - Répondre à un message)
router.post("/:id/reply", authenticateAdmin, async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ error: "Sujet et message requis" });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: "Message non trouvé" });
    }

    // Envoi de la réponse
    await transporter.sendMail({
      from: `"Portfolio Admin" <${process.env.SMTP_USER}>`,
      to: contact.email,
      subject: subject,
      text: message,
      html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
    });

    // Marquer comme répondu
    contact.replied = true;
    contact.repliedAt = new Date();
    await contact.save();

    res.json({ message: "Réponse envoyée avec succès" });
  } catch (error) {
    console.error("Erreur envoi réponse:", error);
    res.status(500).json({ error: "Erreur envoi réponse" });
  }
});

export { router as contactRoutes };