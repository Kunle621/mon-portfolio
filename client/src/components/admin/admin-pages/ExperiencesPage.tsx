// src/components/admin/admin-pages/ExperiencesPage.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { experiencesAPI } from "@/lib/api";
import { ExperienceData } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experienceSchema, type ExperienceFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Building2, Calendar, Briefcase, Loader2 } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export function ExperiencesPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienceData | null>(null);
  const {
    register,
    handleSubmit: handleFormSubmit,
    reset: resetHookForm,
    setValue,
    watch,
    formState: { errors: formErrors }
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: { company: "", position: "", startDate: "", endDate: "", description: "" }
  });

  const descriptionValue = watch("description");

  const { data: experiences, isLoading } = useQuery({
    queryKey: ["experiences"],
    queryFn: experiencesAPI.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: ExperienceData) => experiencesAPI.create(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      toast({ title: "Expérience créée avec succès" });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ExperienceData }) =>
      experiencesAPI.update(id, data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      toast({ title: "Expérience mise à jour avec succès" });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => experiencesAPI.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      toast({ title: "Expérience supprimée avec succès" });
    },
    onError: (error: any) => {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    resetHookForm();
    setEditingExperience(null);
  };

  const onSubmit = (data: ExperienceFormData) => {
    if (editingExperience) {
      updateMutation.mutate({ id: editingExperience._id!, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (experience: ExperienceData) => {
    setEditingExperience(experience);
    setValue("company", experience.company);
    setValue("position", experience.position);
    setValue("startDate", experience.startDate);
    setValue("endDate", experience.endDate || "");
    setValue("description", experience.description);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette expérience ?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement des expériences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expériences Professionnelles</h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos expériences de travail et vos réalisations professionnelles
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} size="lg" className="shadow-sm">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Expérience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-6">
              <DialogTitle className="text-2xl font-semibold">
                {editingExperience ? "Modifier l'Expérience" : "Ajouter une Nouvelle Expérience"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium">
                    Entreprise *
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="company"
                      placeholder="Nom de l'entreprise"
                      {...register("company")}
                      className="pl-10"
                    />
                  </div>
                  {formErrors.company && <p className="text-sm text-destructive">{formErrors.company.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-sm font-medium">
                    Poste Occupé *
                  </Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="position"
                      placeholder="Intitulé du poste"
                      {...register("position")}
                      className="pl-10"
                    />
                  </div>
                  {formErrors.position && <p className="text-sm text-destructive">{formErrors.position.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">
                    Date de Début *
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="startDate"
                      type="date"
                      {...register("startDate")}
                      className="pl-10"
                    />
                  </div>
                  {formErrors.startDate && <p className="text-sm text-destructive">{formErrors.startDate.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-sm font-medium">
                    Date de Fin
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="endDate"
                      type="date"
                      {...register("endDate")}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Laissez vide si c'est votre poste actuel</p>
                  {formErrors.endDate && <p className="text-sm text-destructive">{formErrors.endDate.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description et Réalisations *
                </Label>
                <div className="border rounded-lg">
                  <ReactQuill
                    theme="snow"
                    value={descriptionValue || ""}
                    onChange={(value) => setValue("description", value, { shouldValidate: true })}
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'script': 'sub'}, { 'script': 'super' }],
                        ['link'],
                        ['clean']
                      ],
                    }}
                    placeholder="Décrivez vos responsabilités, réalisations et compétences acquises..."
                    className="min-h-[120px]"
                  />
                </div>
                {formErrors.description && <p className="text-sm text-destructive">{formErrors.description.message}</p>}
              </div>

              <Separator />

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-6"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  {editingExperience ? "Mettre à Jour" : "Créer l'Expérience"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Experiences List */}
      <div className="space-y-6">
        {experiences && experiences.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune expérience ajoutée</h3>
              <p className="text-muted-foreground text-center mb-4">
                Commencez par ajouter votre première expérience professionnelle
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une Expérience
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {experiences?.map((experience: ExperienceData) => (
              <Card key={experience._id} className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold mb-2">
                        {experience.position}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-muted-foreground mb-3">
                        <Building2 className="w-4 h-4" />
                        <span className="font-medium">{experience.company}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(experience.startDate).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long'
                          })} - {
                            experience.endDate
                              ? new Date(experience.endDate).toLocaleDateString('fr-FR', {
                                  year: 'numeric',
                                  month: 'long'
                                })
                              : "Présent"
                          }
                        </span>
                        {!experience.endDate && (
                          <Badge variant="secondary" className="ml-2">
                            En cours
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(experience)}
                        className="hover:bg-primary hover:text-primary-foreground"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(experience._id!)}
                        className="hover:bg-destructive hover:text-destructive-foreground"
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Separator className="mb-4" />
                  <div
                    className="prose prose-sm max-w-none text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: experience.description }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}