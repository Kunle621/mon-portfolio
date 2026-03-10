// server/routes/admin.ts
import { Router, Request, Response } from "express";
import { Admin } from "../models/Admin";
import { Contact } from "../models/Contact";
import { Project } from "../models/Project";
import { Newsletter } from "../models/Newsletter";
import { authenticateAdmin } from "../middleware/authAdmin";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { z } from "zod";

dotenv.config();

const router = Router();

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

// ─── 1. LOGIN (GÉNÉRATION OTP) ───────────────────
interface LoginRequestBody {
  email: string;
  password: string;
}

router.post("/login", async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email et mot de passe requis" });
  }

  try {
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Identifiants incorrects" });
    }

    // ✅ Génération OTP (6 chiffres)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // ✅ Sauvegarde DB (Expire dans 10 min)
    admin.otp = otpCode;
    admin.otpExpires = new Date(Date.now() + 10 * 60 * 1000); 
    await admin.save();



    // ✅ Tentative d'envoi d'email (Sécurisée)
    try {
        await transporter.sendMail({
            from: `"Admin Portfolio" <${process.env.SMTP_USER}>`,
            to: admin.email,
            subject: "Votre code de connexion Admin",
            text: `Votre code : ${otpCode}`,
            html: `<p>Votre code est : <strong>${otpCode}</strong></p>`,
        });

    } catch (emailError) {
        console.error("❌ ERREUR EMAIL:", emailError);
        // Fallback pour le développement

    }

    // On renvoie toujours un succès pour que le front affiche l'input OTP
    return res.json({ 
      message: "Code OTP généré", 
      requireOtp: true,
      email: admin.email 
    });

  } catch (error) {
    console.error("Erreur login:", error);
    return res.status(500).json({ error: "Erreur serveur lors de la connexion" });
  }
});

// ─── 2. VERIFY OTP (VÉRIFICATION + TOKEN) ───────
interface VerifyOtpBody {
  email: string;
  otp: string;
}

router.post("/verify-otp", async (req: Request<{}, {}, VerifyOtpBody>, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email et Code OTP requis" });
  }

  try {
    const admin = await Admin.findOne({ email: email.toLowerCase() });

    if (!admin) {
      return res.status(404).json({ error: "Admin non trouvé" });
    }

    // Vérification validité code
    if (!admin.otp || admin.otp !== otp) {
      return res.status(400).json({ error: "Code invalide" });
    }

    // Vérification expiration
    if (!admin.otpExpires || admin.otpExpires < new Date()) {
      return res.status(400).json({ error: "Le code a expiré" });
    }

    // ✅ Succès : Nettoyage et Token
    admin.otp = undefined;
    admin.otpExpires = undefined;
    await admin.save();

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

  } catch (error) {
    console.error("Erreur vérification OTP:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// ─── 3. MESSAGES ────────────────────────────────
router.get("/messages", authenticateAdmin, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    return res.json(messages);
  } catch (error) {
    console.error("Erreur chargement messages:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// ─── 4. STATS ───────────────────────────────────
router.get("/stats", authenticateAdmin, async (req, res) => {
  try {
    const [projectsCount, unreadMessagesCount, subscribersCount] = await Promise.all([
      Project.countDocuments(),
      Contact.countDocuments({ read: false }),
      Newsletter.countDocuments(),
    ]);

    return res.json({
      projectsCount,
      postsCount: 0,
      unreadMessagesCount,
      subscribersCount,
    });
  } catch (error) {
    console.error("Erreur stats:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// ─── 5. SETTINGS: EMAIL ─────────────────────────
const emailSettingsSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

router.patch("/settings", authenticateAdmin, async (req, res) => {
  try {
    const { email } = emailSettingsSchema.parse(req.body);

    // Vérifier si l'email existe déjà ailleurs
    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: "Cet email est déjà utilisé" });
    }

    // Récupérer l'ID depuis le token
    const token = req.headers.authorization!.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const admin = await Admin.findByIdAndUpdate(
      decoded.id,
      { email: email.toLowerCase() },
      { new: true, runValidators: true }
    );

    return res.json({ email: admin!.email });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: (error as any).errors[0].message });
    }
    console.error("Erreur mise à jour email:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

// ─── 6. SETTINGS: PASSWORD ──────────────────────
const passwordSettingsSchema = z.object({
  currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
  newPassword: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères"),
  // On ne vérifie pas confirmPassword côté backend, vu que le frontend le fait et n'envoie que newPassword 
  // Mais pour rester safe, on demande juste currentPassword et newPassword
});

router.patch("/settings/password", authenticateAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = passwordSettingsSchema.parse(req.body);

    const token = req.headers.authorization!.split(" ")[1];
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

    return res.json({ message: "Mot de passe mis à jour" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: (error as any).errors[0].message });
    }
    console.error("Erreur changement mot de passe:", error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
});

export { router as adminRoutes };