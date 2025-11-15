import express from "express";
import { Contact } from "../models/Contact.js";
import { Newsletter } from "../models/Newsletter.js";
import { Project } from "../models/Project.js";
import { Admin } from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const router = express.Router();

// POST /api/admin/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ error: "Email incorrect" });
    }

    const isMatch = await bcrypt.compare(password ?? "", admin.password ?? "");
    if (!isMatch) {
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET!, { expiresIn: "1d" });
    res.json({ token, admin: { email: admin.email } });
  } catch (error) {
    res.status(500).json({ error: "Erreur connexion" });
  }
});

// GET /api/admin/stats (nécessite auth)
router.get("/stats", async (req, res) => {
  try {
    const projectsCount = await Project.countDocuments();
    const postsCount = 0; // À implémenter plus tard
    const unreadMessagesCount = await Contact.countDocuments({ read: false });
    const subscribersCount = await Newsletter.countDocuments();

    res.json({
      projectsCount,
      postsCount,
      unreadMessagesCount,
      subscribersCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Erreur stats" });
  }
});

// GET /api/admin/messages (nécessite auth)
router.get("/messages", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Erreur messages" });
  }
});

export { router as adminRoutes };