// src/components/admin/admin-pages/ServicesSkillsPage.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { servicesAPI, skillsAPI } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import * as LucideIcons from "lucide-react";
import { Trash2, Plus, Zap, Code2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ServiceData, SkillData } from "@/types";

// Liste des icônes disponibles — tu peux l’étendre facilement
const availableIcons = [
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

export function ServicesSkillsPage() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [newService, setNewService] = useState({
    icon: "Code2",
    titleFr: "",
    titleEn: "",
    descriptionFr: "",
    descriptionEn: "",
  });
  const [newSkill, setNewSkill] = useState({
    name: "",
    icon: "Code2",
    category: "Frontend",
    color: "text-blue-500",
  });

  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [targetField, setTargetField] = useState<"service" | "skill">("service");

  // --- SERVICES ---
  const { data: services } = useQuery<ServiceData[]>({
    queryKey: ["services"],
    queryFn: servicesAPI.getAll,
  });

  const createService = useMutation({
    mutationFn: (data: any) => servicesAPI.create(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setNewService({
        icon: "Code2",
        titleFr: "",
        titleEn: "",
        descriptionFr: "",
        descriptionEn: "",
      });
      toast({ title: t("Service ajouté", "Service added") });
    },
  });

  const deleteService = useMutation({
    mutationFn: (id: string) => servicesAPI.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast({ title: t("Service supprimé", "Service deleted") });
    },
  });

  // --- SKILLS ---
  const { data: skills } = useQuery<SkillData[]>({
    queryKey: ["skills"],
    queryFn: skillsAPI.getAll,
  });

  const createSkill = useMutation({
    mutationFn: (data: any) => skillsAPI.create(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      setNewSkill({
        name: "",
        icon: "Code2",
        category: "Frontend",
        color: "text-blue-500",
      });
      toast({ title: t("Compétence ajoutée", "Skill added") });
    },
  });

  const deleteSkill = useMutation({
    mutationFn: (id: string) => skillsAPI.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast({ title: t("Compétence supprimée", "Skill deleted") });
    },
  });

  // Fonction utilitaire pour récupérer une icône par son nom
  const getIconComponent = (name: string) => {
    const Icon = LucideIcons[name as keyof typeof LucideIcons] as any;
    return Icon ? <Icon className="w-4 h-4" /> : null;
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">{t("Services & Compétences", "Services & Skills")}</h1>

      {/* SECTION SERVICES */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" /> {t("Services", "Services")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
            {/* Sélecteur d'icône pour service */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">{t("Icône", "Icon")}</label>
              <Button
                type="button"
                variant="outline"
                className="justify-between"
                onClick={() => {
                  setTargetField("service");
                  setIsIconPickerOpen(true);
                }}
              >
                {newService.icon ? (
                  <>
                    {getIconComponent(newService.icon)}
                    <span className="ml-2">{newService.icon}</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">
                    {t("Sélectionner...", "Select...")}
                  </span>
                )}
              </Button>
            </div>
            <div className="hidden md:block"></div>

            <Input
              placeholder={t("Titre (FR)", "Title (FR)")}
              value={newService.titleFr}
              onChange={(e) => setNewService({ ...newService, titleFr: e.target.value })}
            />
            <Input
              placeholder={t("Title (EN)", "Title (EN)")}
              value={newService.titleEn}
              onChange={(e) => setNewService({ ...newService, titleEn: e.target.value })}
            />
            <Input
              placeholder={t("Description (FR)", "Description (FR)")}
              value={newService.descriptionFr}
              onChange={(e) => setNewService({ ...newService, descriptionFr: e.target.value })}
            />
            <Input
              placeholder={t("Description (EN)", "Description (EN)")}
              value={newService.descriptionEn}
              onChange={(e) => setNewService({ ...newService, descriptionEn: e.target.value })}
            />
            <Button
              onClick={() => createService.mutate(newService)}
              disabled={createService.isPending}
            >
              <Plus className="w-4 h-4 mr-2" /> {t("Ajouter", "Add")}
            </Button>
          </div>

          <div className="grid gap-3">
            {services?.map((service) => (
              <div
                key={service._id}
                className="flex justify-between items-center p-3 bg-muted/20 rounded border"
              >
                <div className="flex items-center gap-3">
                  {getIconComponent(service.icon)}
                  <div>
                    <div className="font-bold">{service.titleFr}</div>
                    <div className="text-xs text-muted-foreground">{service.descriptionFr}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteService.mutate(service._id)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SECTION SKILLS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="w-5 h-5" /> {t("Compétences", "Skills")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 border-b pb-4">
            <Input
              className="w-40"
              placeholder={t("Nom (ex: React)", "Name (e.g. React)")}
              value={newSkill.name}
              onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            />
            {/* Sélecteur d'icône pour skill */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-40 justify-between"
              onClick={() => {
                setTargetField("skill");
                setIsIconPickerOpen(true);
              }}
            >
              {newSkill.icon ? (
                <>
                  {getIconComponent(newSkill.icon)}
                  <span className="ml-1">{newSkill.icon}</span>
                </>
              ) : (
                <span className="text-muted-foreground text-xs">
                  {t("Icône...", "Icon...")}
                </span>
              )}
            </Button>
            <Input
              className="w-40"
              placeholder={t("Couleur (tailwind)", "Color (Tailwind class)")}
              value={newSkill.color}
              onChange={(e) => setNewSkill({ ...newSkill, color: e.target.value })}
            />
            <Button
              onClick={() => createSkill.mutate(newSkill)}
              disabled={createSkill.isPending}
            >
              <Plus className="w-4 h-4 mr-2" /> {t("Ajouter", "Add")}
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            {skills?.map((skill) => (
              <div
                key={skill._id}
                className="flex items-center gap-2 p-2 bg-muted rounded border"
              >
                <span className={`font-medium ${skill.color}`}>
                  {getIconComponent(skill.icon)}
                  <span className="ml-1">{skill.name}</span>
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => deleteSkill.mutate(skill._id)}
                >
                  <Trash2 className="w-3 h-3 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* MODALE DE SÉLECTION D’ICÔNES */}
      {isIconPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-background border rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">{t("Sélectionner une icône", "Select an icon")}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsIconPickerOpen(false)}
              >
                ✕
              </Button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 overflow-y-auto pr-2 max-h-[60vh]">
              {availableIcons.map(({ name, Icon }) => (
                <Button
                  key={name}
                  variant="ghost"
                  className="flex flex-col items-center justify-center h-16 gap-1 text-xs hover:bg-muted hover:text-foreground"
                  onClick={() => {
                    if (targetField === "service") {
                      setNewService({ ...newService, icon: name });
                    } else {
                      setNewSkill({ ...newSkill, icon: name });
                    }
                    setIsIconPickerOpen(false);
                  }}
                >
                  <Icon className="w-6 h-6" />
                  <span className="mt-1">{name}</span>
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {t("Cliquez sur une icône pour la sélectionner.", "Click an icon to select it.")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}