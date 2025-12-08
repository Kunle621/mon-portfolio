// backend/routes/profileRoutes.ts
import express from "express";
import fs from "fs";
import { Profile as ProfileModel } from "../models/Profile";
import { authenticateAdmin } from "../middleware/authAdmin";
import { upload } from "../middleware/upload";
import cloudinary from "../cloudinary";

const router = express.Router();

// GET /api/profile (Public)
router.get("/", async (req, res) => {
  try {
    let profile = await ProfileModel.findOne();
    if (!profile) {
      profile = new ProfileModel();
      await profile.save();
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT /api/profile (Admin)
router.put("/", authenticateAdmin, async (req, res) => {
  try {
    let profile = await ProfileModel.findOne();
    if (!profile) profile = new ProfileModel(req.body);
    else Object.assign(profile, req.body);

    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Erreur mise à jour profil" });
  }
});

// POST /api/profile/upload-headshot
router.post("/upload-headshot", authenticateAdmin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "portfolio/profile",
    });
    fs.unlinkSync(req.file.path); // Supprime le fichier local

    res.json({ headshotUrl: result.secure_url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/profile/upload-cv
router.post("/upload-cv", authenticateAdmin, upload.single("cv"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Aucun fichier reçu" });

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: "portfolio/cv",
      format: "pdf",
    });
    fs.unlinkSync(req.file.path);

    res.json({ cvUrl: result.secure_url });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export { router as profileRoutes };
