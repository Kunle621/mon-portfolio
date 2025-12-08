import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { adminStatsAPI, adminMessagesAPI } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { FolderKanban, FileText, MessageSquare, Users, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function DashboardPage() {
  const { t } = useLanguage();
  const { token } = useAuth();
  const [, setLocation] = useLocation();

  // Utilisation des mêmes clés de query que les autres pages pour le cache partagé
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => adminStatsAPI.get(token!),
    enabled: !!token,
  });

  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: () => adminMessagesAPI.getAll(token!),
    enabled: !!token,
  });

  const unreadCount = messages?.filter((m: any) => !m.read).length || 0;

  const statCards = [
    { labelFr: "Projets", labelEn: "Projects", value: stats?.projectsCount || 0, icon: FolderKanban, color: "text-blue-500 bg-blue-500/10", link: "/admin/projects" },
    { labelFr: "Messages non lus", labelEn: "Unread", value: unreadCount, icon: MessageSquare, color: "text-amber-500 bg-amber-500/10", link: "/admin/messages" },
    { labelFr: "Abonnés", labelEn: "Subscribers", value: stats?.subscribersCount || 0, icon: Users, color: "text-green-500 bg-green-500/10", link: "/admin/newsletter" },
    { labelFr: "Articles", labelEn: "Posts", value: stats?.postsCount || 0, icon: FileText, color: "text-purple-500 bg-purple-500/10", link: "/admin/blog" },
  ];

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-6 border-b bg-card/50">
        <h1 className="text-2xl font-bold">{t("Tableau de bord", "Dashboard")}</h1>
        <Button size="icon" variant="ghost" className="relative" onClick={() => setLocation("/admin/messages")}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-background" />
          )}
        </Button>
      </header>

      <main className="p-6 space-y-8 flex-1 overflow-auto">
        {/* Cartes Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsLoading
            ? [1, 2, 3, 4].map((i) => <Card key={i} className="h-32 animate-pulse bg-muted" />)
            : statCards.map((stat, index) => (
                <Card 
                  key={index} 
                  className="p-6 flex items-center justify-between hover:shadow-lg transition-all cursor-pointer border-l-4"
                  onClick={() => setLocation(stat.link)}
                  style={{ borderLeftColor: 'currentColor' }} // Astuce pour la couleur
                >
                  <div>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{t(stat.labelFr, stat.labelEn)}</div>
                  </div>
                  <div className={`p-4 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </Card>
              ))}
        </div>

        {/* Aperçu Messages Récents */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 flex flex-col">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              {t("Messages récents", "Recent Messages")}
            </h2>
            <div className="space-y-4 flex-1">
              {messagesLoading ? (
                 <div className="space-y-2">{[1,2].map(i => <div key={i} className="h-16 bg-muted rounded animate-pulse"/>)}</div>
              ) : messages && messages.length > 0 ? (
                messages.slice(0, 3).map((msg: any) => (
                  <div key={msg._id} className="p-3 rounded-lg bg-muted/30 border flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-sm">{msg.name}</span>
                        <span className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{msg.message}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">{t("Aucun message", "No messages")}</div>
              )}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => setLocation("/admin/messages")}>
                {t("Voir tout", "View All")}
            </Button>
          </Card>

          <Card className="p-6">
             <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {t("Activité", "Activity")}
            </h2>
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground bg-muted/10 rounded-lg border-dashed border-2">
                <p>{t("Graphiques bientôt disponibles...", "Charts coming soon...")}</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}