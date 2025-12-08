// client/src/pages/admin/SettingsPage.tsx
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { profileAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, FileText, Link as LinkIcon, Save, Upload } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProfileData } from "@/types";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export function SettingsPage() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Charger le profil depuis l'API
  const { data: profile } = useQuery<ProfileData>({
    queryKey: ["profile"],
    queryFn: () => profileAPI.get(),
  });

  const [formData, setFormData] = useState<ProfileData>({} as ProfileData);

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  // Mutation update
  const updateMutation = useMutation({
    mutationFn: (data: any) => profileAPI.update(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: t("Succès", "Success"),
        description: t("Profil mis à jour", "Profile updated"),
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: t("Erreur", "Error"),
        description: "Impossible de mettre à jour le profil.",
      });
    }
  });

  // Fonction générique pour modifier un champ
  const handleChange = (field: keyof ProfileData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- UPLOAD PHOTO ---
  const uploadHeadshot = async (file: File) => {
    if (!token) return;
    try {
      const form = new FormData();
      form.append("image", file);
      const data = await profileAPI.uploadHeadshot(form, token);
      if (data.headshotUrl) handleChange("headshotUrl", data.headshotUrl);
      toast({ title: t("Succès", "Success"), description: "Photo de profil uploadée." });
    } catch (error) {
      toast({ variant: "destructive", title: t("Erreur", "Error"), description: "Échec de l'upload de la photo." });
    }
  };

  // --- UPLOAD CV PDF ---
  const uploadCV = async (file: File) => {
    if (!token) return;
    try {
      const form = new FormData();
      form.append("cv", file);
      const data = await profileAPI.uploadCV(form, token);
      if (data.cvUrl) handleChange("cvUrl", data.cvUrl);
      toast({ title: t("Succès", "Success"), description: "CV uploadé avec succès." });
    } catch (error) {
      toast({ variant: "destructive", title: t("Erreur", "Error"), description: "Échec de l'upload du CV." });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">{t("Mon Profil & CV", "My Profile & CV")}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* --- INFO PERSO --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" /> Info Personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Nom complet"
                value={formData.name || ""}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              <Input
                placeholder="Email"
                value={formData.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Titre (FR)"
                value={formData.titleFr || ""}
                onChange={(e) => handleChange("titleFr", e.target.value)}
              />
              <Input
                placeholder="Title (EN)"
                value={formData.titleEn || ""}
                onChange={(e) => handleChange("titleEn", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Téléphone"
                value={formData.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
              <Input
                placeholder="Localisation"
                value={formData.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>

            {/* --- DISPONIBILITÉ --- */}
            <div>
              <Input
                placeholder="Disponibilité"
                value={formData.availability || ""}
                onChange={(e) => handleChange("availability", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* --- BIO + PHOTO + CV --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" /> Bio, Photo & CV
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* PHOTO DE PROFIL */}
            <div className="space-y-2">
              <label className="font-medium">Photo de Profil</label>
              <div className="flex items-center gap-4">
                {formData.headshotUrl ? (
                  <img
                    src={formData.headshotUrl}
                    className="w-20 h-20 rounded-full object-cover"
                    alt="Profil"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 rounded-full" />
                )}

                <Button variant="secondary" asChild>
                  <label className="cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Choisir une image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files && uploadHeadshot(e.target.files[0])}
                    />
                  </label>
                </Button>
              </div>
            </div>

            {/* CV PDF */}
            <div className="space-y-2">
              <label className="font-medium">CV (PDF)</label>
              <div className="flex items-center gap-4">
                {formData.cvUrl ? (
                  <a
                    className="text-blue-600 underline"
                    href={formData.cvUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Voir le CV
                  </a>
                ) : (
                  <span>Aucun CV</span>
                )}

                <Button variant="secondary" asChild>
                  <label className="cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4" /> Uploader un PDF
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => e.target.files && uploadCV(e.target.files[0])}
                    />
                  </label>
                </Button>
              </div>
            </div>

            {/* BIO FR */}
            <div>
              <label className="font-medium">Bio (FR)</label>
              <ReactQuill
                theme="snow"
                value={formData.bioFr || ""}
                onChange={(v) => handleChange("bioFr", v)}
              />
            </div>

            {/* BIO EN */}
            <div>
              <label className="font-medium">Bio (EN)</label>
              <ReactQuill
                theme="snow"
                value={formData.bioEn || ""}
                onChange={(v) => handleChange("bioEn", v)}
              />
            </div>
          </CardContent>
        </Card>

        {/* --- RÉSEAUX SOCIAUX --- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5" /> Réseaux Sociaux
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-4">
            <Input
              placeholder="GitHub URL"
              value={formData.githubUrl || ""}
              onChange={(e) => handleChange("githubUrl", e.target.value)}
            />
            <Input
              placeholder="LinkedIn URL"
              value={formData.linkedinUrl || ""}
              onChange={(e) => handleChange("linkedinUrl", e.target.value)}
            />
            <Input
              placeholder="Twitter URL"
              value={formData.twitterUrl || ""}
              onChange={(e) => handleChange("twitterUrl", e.target.value)}
            />
          </CardContent>
        </Card>

        <Button
          type="submit"
          size="lg"
          disabled={updateMutation.isPending}
          className="w-full"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateMutation.isPending ? "Enregistrement..." : t("Enregistrer les modifications", "Save Changes")}
        </Button>
      </form>
    </div>
  );
}
