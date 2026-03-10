import { z } from "zod";

// --- Contact Form ---
export const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// --- Newsletter Form ---
export const newsletterSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// --- Admin Login ---
export const loginSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const otpSchema = z.object({
  otp: z.string().length(6, "Le code doit contenir exactement 6 chiffres").regex(/^\d+$/, "Le code ne doit contenir que des chiffres"),
});

export type OtpFormData = z.infer<typeof otpSchema>;

// --- Admin Settings ---
export const emailSettingsSchema = z.object({
  email: z.string().email("Adresse email invalide"),
});

export type EmailSettingsFormData = z.infer<typeof emailSettingsSchema>;

export const passwordSettingsSchema = z.object({
  currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
  newPassword: z.string().min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export type PasswordSettingsFormData = z.infer<typeof passwordSettingsSchema>;

// --- Projects ---
export const projectSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  tags: z.string().min(2, "Veuillez entrer au moins un tag"),
  link: z.string().url("URL invalide").optional().or(z.literal('')),
  github: z.string().url("URL invalide").optional().or(z.literal('')),
  image: z.any().optional(), // Pour le File, la validation est gérée à part souvent
});

export type ProjectFormData = z.infer<typeof projectSchema>;

// --- Experiences ---
export const experienceSchema = z.object({
  position: z.string().min(2, "Le poste doit contenir au moins 2 caractères"),
  company: z.string().min(2, "L'entreprise doit contenir au moins 2 caractères"),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().optional(),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
});

export type ExperienceFormData = z.infer<typeof experienceSchema>;
