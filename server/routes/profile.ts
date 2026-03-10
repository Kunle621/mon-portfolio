// backend/routes/profileRoutes.ts
import express from "express";
import { Profile as ProfileModel } from "../models/Profile";
import { authenticateAdmin } from "../middleware/authAdmin";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `cv-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

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

// POST /api/profile/upload-cv (Admin)
router.post("/upload-cv", authenticateAdmin, upload.single("cv"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier uploadé" });
    }
    const cvUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    
    let profile = await ProfileModel.findOne();
    if (!profile) profile = new ProfileModel({ cvUrl });
    else profile.cvUrl = cvUrl;

    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'upload du CV" });
  }
});

export { router as profileRoutes };
