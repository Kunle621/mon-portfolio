// routes/admin.ts
import { Router, Request, Response } from "express";
import { Admin } from "../models/Admin";
import { Contact } from "../models/Contact";
import { Project } from "../models/Project";
import { Newsletter } from "../models/Newsletter";
import { authenticateAdmin } from "../middleware/authAdmin";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const router = Router();

// ─── LOGIN ───────────────────────────────────────
interface LoginRequestBody {
  email: string;
  password: string;
}

router.post("/login", async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) {
    return res.status(401).json({ error: "Email incorrect" });
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ error: "Mot de passe incorrect" });
  }

  const token = jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return res.json({
    token,
    admin: {
      id: admin._id.toString(),
      email: admin.email,
    },
  });
});

// ─── MESSAGES ─────────────────────────────────────
router.get("/messages", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    return res.json(messages);
  } catch (error) {
    console.error("Erreur chargement messages:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// ─── STATS ────────────────────────────────────────
router.get("/stats", async (req, res) => {
  try {
    const [projectsCount, unreadMessagesCount, subscribersCount] = await Promise.all([
      Project.countDocuments(),
      Contact.countDocuments({ read: false }),
      Newsletter.countDocuments(),
    ]);

    return res.json({
      projectsCount,
      postsCount: 0, // à activer plus tard si tu ajoutes un blog
      unreadMessagesCount,
      subscribersCount,
    });
  } catch (error) {
    console.error("Erreur stats:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// ─── SETTINGS : UPDATE EMAIL ───────────────────────
router.patch("/settings", authenticateAdmin, async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email requis" });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }

    const authHeader = req.headers.authorization!;
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const admin = await Admin.findByIdAndUpdate(
      decoded.id,
      { email: email.toLowerCase() },
      { new: true, runValidators: true }
    );

    return res.json({ email: admin!.email });
  } catch (error) {
    console.error("Erreur mise à jour email:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// ─── SETTINGS : UPDATE PASSWORD ─────────────────────
router.patch("/settings/password", authenticateAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const authHeader = req.headers.authorization!;
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(404).json({ error: "Admin non trouvé" });
    }
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: "Mot de passe actuel incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();
    await admin.save();

    return res.json({ message: "Mot de passe mis à jour" });
  } catch (error) {
    console.error("Erreur changement mot de passe:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export { router as adminRoutes };