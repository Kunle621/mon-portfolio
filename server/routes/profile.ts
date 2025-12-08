import express from "express";
import { Profile } from "../models/Profile"; // Attention au chemin d'import selon ta structure (parfois ../models/Profile)
// CORRECTION IMPORT:
import { Profile as ProfileModel } from "../models/Profile"; 
import { authenticateAdmin } from "../middleware/authAdmin";

const router = express.Router();

// GET /api/profile (Public)
router.get("/", async (req, res) => {
  try {
    // On récupère le premier profil ou on en crée un vide s'il n'existe pas
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
    if (!profile) {
        profile = new ProfileModel(req.body);
    } else {
        Object.assign(profile, req.body);
    }
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Erreur mise à jour profil" });
  }
});

export { router as profileRoutes };