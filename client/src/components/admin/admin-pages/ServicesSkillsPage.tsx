// src/components/admin/admin-pages/ServicesSkillsPage.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { servicesAPI, skillsAPI } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Zap, Code2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ServiceData, SkillData } from "@/types";

export function ServicesSkillsPage() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [newService, setNewService] = useState({ icon: "Code2", titleFr: "", titleEn: "", descriptionFr: "", descriptionEn: "" });
  const [newSkill, setNewSkill] = useState({ name: "", icon: "Code2", category: "Frontend", color: "text-blue-500" });

  // --- SERVICES ---
  const { data: services } = useQuery<ServiceData[]>({ queryKey: ["services"], queryFn: servicesAPI.getAll });
  
  const createService = useMutation({
    mutationFn: (data: any) => servicesAPI.create(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      setNewService({ icon: "Code2", titleFr: "", titleEn: "", descriptionFr: "", descriptionEn: "" });
      toast({ title: t("Service ajouté", "Service added") });
    }
  });

  const deleteService = useMutation({
    mutationFn: (id: string) => servicesAPI.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast({ title: t("Service supprimé", "Service deleted") });
    }
  });

  // --- SKILLS ---
  const { data: skills } = useQuery<SkillData[]>({ queryKey: ["skills"], queryFn: skillsAPI.getAll });

  const createSkill = useMutation({
    mutationFn: (data: any) => skillsAPI.create(data, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      setNewSkill({ name: "", icon: "Code2", category: "Frontend", color: "text-blue-500" });
      toast({ title: t("Compétence ajoutée", "Skill added") });
    }
  });

  const deleteSkill = useMutation({
    mutationFn: (id: string) => skillsAPI.delete(id, token!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      toast({ title: t("Compétence supprimée", "Skill deleted") });
    }
  });

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">{t("Services & Compétences", "Services & Skills")}</h1>

      {/* SECTION SERVICES */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="w-5 h-5"/> Services</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-b pb-4">
             <Input placeholder="Nom Icone (ex: Code2)" value={newService.icon} onChange={e => setNewService({...newService, icon: e.target.value})} />
             <div className="hidden md:block"></div>
             <Input placeholder="Titre (FR)" value={newService.titleFr} onChange={e => setNewService({...newService, titleFr: e.target.value})} />
             <Input placeholder="Title (EN)" value={newService.titleEn} onChange={e => setNewService({...newService, titleEn: e.target.value})} />
             <Input placeholder="Description (FR)" value={newService.descriptionFr} onChange={e => setNewService({...newService, descriptionFr: e.target.value})} />
             <Input placeholder="Description (EN)" value={newService.descriptionEn} onChange={e => setNewService({...newService, descriptionEn: e.target.value})} />
             <Button onClick={() => createService.mutate(newService)} disabled={createService.isPending}><Plus className="w-4 h-4 mr-2"/> Ajouter</Button>
          </div>

          <div className="grid gap-3">
             {services?.map(service => (
                <div key={service._id} className="flex justify-between items-center p-3 bg-muted/20 rounded border">
                    <div>
                        <div className="font-bold">{service.titleFr}</div>
                        <div className="text-xs text-muted-foreground">{service.descriptionFr}</div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteService.mutate(service._id)}><Trash2 className="w-4 h-4 text-destructive"/></Button>
                </div>
             ))}
          </div>
        </CardContent>
      </Card>

      {/* SECTION SKILLS */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Code2 className="w-5 h-5"/> Compétences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 border-b pb-4">
             <Input className="w-40" placeholder="Nom (ex: React)" value={newSkill.name} onChange={e => setNewSkill({...newSkill, name: e.target.value})} />
             <Input className="w-40" placeholder="Icone (ex: Code2)" value={newSkill.icon} onChange={e => setNewSkill({...newSkill, icon: e.target.value})} />
             <Input className="w-40" placeholder="Couleur (tailwind)" value={newSkill.color} onChange={e => setNewSkill({...newSkill, color: e.target.value})} />
             <Button onClick={() => createSkill.mutate(newSkill)} disabled={createSkill.isPending}><Plus className="w-4 h-4 mr-2"/> Ajouter</Button>
          </div>

          <div className="flex flex-wrap gap-3">
             {skills?.map(skill => (
                <div key={skill._id} className="flex items-center gap-2 p-2 bg-muted rounded border">
                    <span className={`font-medium ${skill.color}`}>{skill.name}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteSkill.mutate(skill._id)}><Trash2 className="w-3 h-3 text-destructive"/></Button>
                </div>
             ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}