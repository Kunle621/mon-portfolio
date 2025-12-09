import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { projectsAPI } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Link as LinkIcon, Github, Image as ImageIcon, Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["web", "mobile", "deeplearning", "datascience"];

export function ProjectsPage() {
  const { t, language } = useLanguage();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const emptyForm = {
    titleFr: "",
    titleEn: "",
    descriptionFr: "",
    descriptionEn: "",
    categories: [] as string[],
    githubUrl: "",
    demoUrl: "",
    imageUrl: "",
  };
  const [formData, setFormData] = useState(emptyForm);

  // --- Fetch projects ---
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: projectsAPI.getAll,
  });

  // --- CREATE mutation ---
  const createMutation = useMutation({
    mutationFn: async () => {
      let uploadedImageUrl = formData.imageUrl;

      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        const res = await projectsAPI.uploadImage(fd, token!);
        uploadedImageUrl = res.imageUrl;
      }

      return projectsAPI.create({ ...formData, imageUrl: uploadedImageUrl }, token!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      resetForm();
      toast({ title: t("Succès", "Success"), description: t("Projet créé !", "Project created!") });
    },
  });

  // --- UPDATE mutation ---
  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editingProjectId) return;

      let uploadedImageUrl = formData.imageUrl;
      if (imageFile) {
        const fd = new FormData();
        fd.append("image", imageFile);
        const res = await projectsAPI.uploadImage(fd, token!);
        uploadedImageUrl = res.imageUrl;
      }

      return projectsAPI.update(editingProjectId, { ...formData, imageUrl: uploadedImageUrl }, token!);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      resetForm();
      toast({ title: t("Succès", "Success"), description: t("Projet modifié !", "Project updated!") });
    },
  });

  // --- DELETE mutation ---
  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsAPI.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast({ title: t("Supprimé", "Deleted"), description: t("Projet supprimé", "Project deleted") });
    },
  });

  // --- Reset form ---
  const resetForm = () => {
    setFormData(emptyForm);
    setEditingProjectId(null);
    setImageFile(null);
  };

  // --- Submit handler ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editingProjectId ? updateMutation.mutate() : createMutation.mutate();
  };

  // --- Start editing ---
  const startEditing = (project: any) => {
    setFormData({
      titleFr: project.titleFr,
      titleEn: project.titleEn,
      descriptionFr: project.descriptionFr,
      descriptionEn: project.descriptionEn,
      categories: project.categories || [],
      githubUrl: project.githubUrl || "",
      demoUrl: project.demoUrl || "",
      imageUrl: project.imageUrl || "",
    });

    setEditingProjectId(project._id);
    setIsFormOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t("Gestion des projets", "Projects Management")}</h1>
        <Button onClick={() => setIsFormOpen(prev => !prev)}>
          <Plus className="mr-2 h-4 w-4" /> {isFormOpen ? t("Fermer", "Close") : t("Ajouter", "Add")}
        </Button>
      </div>

      {/* FORM */}
      {isFormOpen && (
        <Card className="p-6 border-primary/20 bg-muted/10 animate-in slide-in-from-top-2">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* TITLES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input required placeholder="Titre FR" value={formData.titleFr}
                onChange={e => setFormData({ ...formData, titleFr: e.target.value })} />
              <Input required placeholder="Title EN" value={formData.titleEn}
                onChange={e => setFormData({ ...formData, titleEn: e.target.value })} />
            </div>

            {/* DESCRIPTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea required placeholder="Description FR" value={formData.descriptionFr}
                onChange={e => setFormData({ ...formData, descriptionFr: e.target.value })} />
              <Textarea required placeholder="Description EN" value={formData.descriptionEn}
                onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })} />
            </div>

            {/* CATEGORIES */}
            <div>
              <label className="font-semibold">Catégories :</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(cat)}
                      onChange={() => {
                        setFormData(prev =>
                          prev.categories.includes(cat)
                            ? { ...prev, categories: prev.categories.filter(c => c !== cat) }
                            : { ...prev, categories: [...prev.categories, cat] }
                        );
                      }}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* LINKS + IMAGE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input placeholder="GitHub URL" value={formData.githubUrl}
                onChange={e => setFormData({ ...formData, githubUrl: e.target.value })} />

              <Input placeholder="Demo URL" value={formData.demoUrl}
                onChange={e => setFormData({ ...formData, demoUrl: e.target.value })} />

              <Input type="file" accept="image/*"
                onChange={e => setImageFile(e.target.files?.[0] || null)} />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="ghost" onClick={() => { resetForm(); setIsFormOpen(false); }}>{t("Annuler", "Cancel")}</Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingProjectId ? t("Modifier", "Update") : t("Créer", "Create")}
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p>{t("Chargement...", "Loading...")}</p>
        ) : (
          projects?.map((project: any) => (
            <Card key={project._id} className="relative p-3 flex flex-col">
              {/* IMAGE */}
              <div className="h-40 bg-muted flex items-center justify-center">
                {project.imageUrl ? (
                  <img className="w-full h-full object-cover" src={project.imageUrl} />
                ) : (
                  <ImageIcon className="w-10 h-10 text-muted-foreground" />
                )}
              </div>

              {/* CONTENT */}
              <h3 className="mt-3 font-bold text-lg">
                {language === "fr" ? project.titleFr : project.titleEn}
              </h3>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {language === "fr" ? project.descriptionFr : project.descriptionEn}
              </p>

              {/* CATEGORIES */}
              <div className="flex flex-wrap gap-1 mt-2">
                {project.categories?.map((c: string) => (
                  <span key={c} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {c}
                  </span>
                ))}
              </div>

              {/* LINKS */}
              <div className="flex gap-2 mt-3">
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" className="p-2 bg-muted rounded">
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {project.demoUrl && (
                  <a href={project.demoUrl} target="_blank" className="p-2 bg-muted rounded">
                    <LinkIcon className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-2 mt-4">
                <Button size="icon" variant="outline"
                  onClick={() => startEditing(project)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="destructive"
                  onClick={() => deleteMutation.mutate(project._id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
