// client/src/pages/admin/SettingsPage.tsx
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { profileAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, FileText, Link as LinkIcon, Save, Upload } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { emailSettingsSchema } from "@/lib/validations";
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

  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    setValue: setProfileValue,
    watch: watchProfile
  } = useForm<ProfileData>({
    defaultValues: {}
  });

  const bioFr = watchProfile("bioFr");
  const bioEn = watchProfile("bioEn");

  useEffect(() => {
    if (profile) {
      Object.keys(profile).forEach((key) => {
        setProfileValue(key as keyof ProfileData, profile[key as keyof ProfileData]);
      });
    }
  }, [profile, setProfileValue]);

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



  // --- UPLOAD PHOTO ---
  const uploadHeadshot = async (file: File) => {
    if (!token) return;
    try {
      const form = new FormData();
      form.append("image", file);
      const data = await profileAPI.uploadHeadshot(form, token);
      if (data.headshotUrl) setProfileValue("headshotUrl", data.headshotUrl);
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
      if (data.cvUrl) setProfileValue("cvUrl", data.cvUrl);
      toast({ title: t("Succès", "Success"), description: "CV uploadé avec succès." });
    } catch (error) {
      toast({ variant: "destructive", title: t("Erreur", "Error"), description: "Échec de l'upload du CV." });
    }
  };

  const onProfileSubmit = (data: ProfileData) => {
    let emailValid = true;
    try {
        emailSettingsSchema.parse({ email: data.email });
    } catch (e: any) {
        toast({ variant: "destructive", title: "Erreur Email", description: e.errors[0].message });
        emailValid = false;
    }
    if (emailValid) {
        updateMutation.mutate(data);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">{t("Mon Profil & CV", "My Profile & CV")}</h1>

      <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-6">
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
                {...registerProfile("name")}
              />
              <div>
                <Input
                  placeholder="Email"
                  {...registerProfile("email")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Titre (FR)"
                {...registerProfile("titleFr")}
              />
              <Input
                placeholder="Title (EN)"
                {...registerProfile("titleEn")}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Téléphone"
                {...registerProfile("phone")}
              />
              <Input
                placeholder="Localisation"
                {...registerProfile("location")}
              />
            </div>

            {/* --- DISPONIBILITÉ --- */}
            <div>
              <Input
                placeholder="Disponibilité"
                {...registerProfile("availability")}
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
                {watchProfile("headshotUrl") ? (
                  <img
                    src={watchProfile("headshotUrl")}
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
                {watchProfile("cvUrl") ? (
                  <a
                    className="text-blue-600 underline"
                    href={watchProfile("cvUrl")}
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
                value={bioFr || ""}
                onChange={(v) => setProfileValue("bioFr", v)}
              />
            </div>

            {/* BIO EN */}
            <div>
              <label className="font-medium">Bio (EN)</label>
              <ReactQuill
                theme="snow"
                value={bioEn || ""}
                onChange={(v) => setProfileValue("bioEn", v)}
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
              {...registerProfile("githubUrl")}
            />
            <Input
              placeholder="LinkedIn URL"
              {...registerProfile("linkedinUrl")}
            />
            <Input
              placeholder="Twitter URL"
              {...registerProfile("twitterUrl")}
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
