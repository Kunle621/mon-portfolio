// src/lib/icons.ts
import * as LucideIcons from "lucide-react";

// Liste centrale des icônes disponibles — utilisée partout
export const availableIcons = [
  { name: "Code2", Icon: LucideIcons.Code2 },
  { name: "Zap", Icon: LucideIcons.Zap },
  { name: "Database", Icon: LucideIcons.Database },
  { name: "Server", Icon: LucideIcons.Server },
  { name: "Globe", Icon: LucideIcons.Globe },
  { name: "Cloud", Icon: LucideIcons.Cloud },
  { name: "Monitor", Icon: LucideIcons.Monitor },
  { name: "Smartphone", Icon: LucideIcons.Smartphone },
  { name: "Palette", Icon: LucideIcons.Palette },
  { name: "Rocket", Icon: LucideIcons.Rocket },
  { name: "Settings", Icon: LucideIcons.Settings },
  { name: "Cpu", Icon: LucideIcons.Cpu },
  { name: "Network", Icon: LucideIcons.Network },
  { name: "GitBranch", Icon: LucideIcons.GitBranch },
  { name: "ShieldCheck", Icon: LucideIcons.ShieldCheck },
  { name: "BarChart3", Icon: LucideIcons.BarChart3 },
  { name: "Layers", Icon: LucideIcons.Layers },
  { name: "PenTool", Icon: LucideIcons.PenTool },
  { name: "Terminal", Icon: LucideIcons.Terminal },
  { name: "Package", Icon: LucideIcons.Package },
] as const;

// Type pour le nom d’une icône
export type IconName = typeof availableIcons[number]["name"];

// Helper pour récupérer un composant Lucide à partir d’un nom
export const getIconComponent = (name: string) => {
  const iconEntry = availableIcons.find((icon) => icon.name === name);
  return iconEntry ? iconEntry.Icon : LucideIcons.Code2; // fallback
};