import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { projectsAPI } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Link as LinkIcon, Github, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Projects() {
  const { t, language } = useLanguage();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isCreating, setIsCreating] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const initialFormState = {
    titleFr: "", titleEn: "",
    descriptionFr: "", descriptionEn: "",
    category: "", githubUrl: "", demoUrl: ""
  };
  const [newProject, setNewProject] = useState(initialFormState);

  // --- Récupération des projets ---
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsAPI.getAll,
  });

  // --- Création d'un projet ---
  const createMutation = useMutation({
    mutationFn: async () => {
      let imageUrl = "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const res = await projectsAPI.uploadImage(formData, token!);
        imageUrl = res.imageUrl;
      }

      return projectsAPI.create({ ...newProject, imageUrl }, token!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsCreating(false);
      setNewProject(initialFormState);
      setImageFile(null);
      toast({ title: t("Succès", "Success"), description: t("Projet créé !", "Project created!") });
    },
    onError: () => {
      toast({ variant: "destructive", title: t("Erreur", "Error"), description: t("Impossible de créer le projet", "Could not create project") });
    }
  });

  // --- Suppression ---
  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsAPI.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: t("Succès", "Success"), description: t("Projet supprimé", "Project deleted") });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("Gestion des projets", "Projects Management")}</h1>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="mr-2 h-4 w-4" /> {isCreating ? t("Fermer", "Close") : t("Ajouter", "Add New")}
        </Button>
      </div>

      {/* Formulaire d'ajout */}
      {isCreating && (
        <Card className="p-6 border-primary/20 bg-muted/10 animate-in slide-in-from-top-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-semibold text-sm uppercase text-muted-foreground">Contenu Bilingue</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Titre (Français)"
                value={newProject.titleFr}
                onChange={e => setNewProject({ ...newProject, titleFr: e.target.value })}
                required
              />
              <Input
                placeholder="Title (English)"
                value={newProject.titleEn}
                onChange={e => setNewProject({ ...newProject, titleEn: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                placeholder="Description (Français)"
                value={newProject.descriptionFr}
                onChange={e => setNewProject({ ...newProject, descriptionFr: e.target.value })}
                required
              />
              <Textarea
                placeholder="Description (English)"
                value={newProject.descriptionEn}
                onChange={e => setNewProject({ ...newProject, descriptionEn: e.target.value })}
                required
              />
            </div>

            <h3 className="font-semibold text-sm uppercase text-muted-foreground mt-4">Détails</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Catégorie"
                value={newProject.category}
                onChange={e => setNewProject({ ...newProject, category: e.target.value })}
              />
              <Input
                type="file"
                accept="image/*"
                onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="GitHub URL"
                  value={newProject.githubUrl}
                  onChange={e => setNewProject({ ...newProject, githubUrl: e.target.value })}
                />
                <Input
                  placeholder="Demo URL"
                  value={newProject.demoUrl}
                  onChange={e => setNewProject({ ...newProject, demoUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>
                {t("Annuler", "Cancel")}
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "..." : t("Enregistrer", "Save")}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Liste des projets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p>{t("Chargement...", "Loading...")}</p>
        ) : (
          projects?.map((project: any) => (
            <Card key={project._id} className="overflow-hidden flex flex-col group relative hover:shadow-md transition-all">
              <div className="h-40 w-full bg-muted relative flex items-center justify-center overflow-hidden">
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt="Project"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <ImageIcon className="w-10 h-10 text-muted-foreground opacity-50" />
                )}
              </div>

              <div className="p-4 flex flex-col gap-2 flex-1">
                <h3 className="font-bold text-lg">{language === "fr" ? project.titleFr : project.titleEn}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {language === "fr" ? project.descriptionFr : project.descriptionEn}
                </p>
                <div className="mt-auto pt-3 flex items-center gap-2 border-t">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" className="p-2 bg-muted rounded hover:bg-primary hover:text-white transition-colors">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" className="p-2 bg-muted rounded hover:bg-primary hover:text-white transition-colors">
                      <LinkIcon className="w-4 h-4" />
                    </a>
                  )}
                  {project.category && (
                    <span className="ml-auto text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                      {project.category}
                    </span>
                  )}
                </div>
              </div>

              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                onClick={() => { if(confirm(t("Supprimer ce projet ?", "Delete this project?"))) deleteMutation.mutate(project._id); }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
