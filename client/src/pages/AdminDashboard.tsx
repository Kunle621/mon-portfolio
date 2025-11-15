import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { adminStatsAPI, adminMessagesAPI } from "@/lib/api";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Bell,
  Mail,
} from "lucide-react";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { admin, isAuthenticated, logout } = useAuth();
  const [location, setLocation] = useLocation();

  // Redirection si non connecté
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [isAuthenticated, setLocation]);

  // Logout
  const handleLogout = () => {
    logout();
    setLocation("/admin/login");
  };

  // Requêtes React Query
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: adminStatsAPI.get,
    enabled: isAuthenticated,
  });

  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/admin/messages"],
    queryFn: adminMessagesAPI.getAll,
    enabled: isAuthenticated,
  });

  const unreadCount = messagesData?.filter((m) => !m.read).length || 0;

  // Menu latéral
  const menuItems = [
    { icon: LayoutDashboard, labelFr: "Tableau de bord", labelEn: "Dashboard", href: "/admin" },
    { icon: FolderKanban, labelFr: "Projets", labelEn: "Projects", href: "/admin/projects" },
    { icon: FileText, labelFr: "Blog", labelEn: "Blog", href: "/admin/blog" },
    { icon: MessageSquare, labelFr: "Messages", labelEn: "Messages", href: "/admin/messages", badge: unreadCount },
    { icon: Mail, labelFr: "Newsletter", labelEn: "Newsletter", href: "/admin/newsletter" },
    { icon: Settings, labelFr: "Paramètres", labelEn: "Settings", href: "/admin/settings" },
  ];

  // Statistiques
  const stats = [
    { labelFr: "Projets publiés", labelEn: "Published Projects", value: statsData?.projectsCount?.toString() || "0", icon: FolderKanban },
    { labelFr: "Articles de blog", labelEn: "Blog Posts", value: statsData?.postsCount?.toString() || "0", icon: FileText },
    { labelFr: "Messages non lus", labelEn: "Unread Messages", value: statsData?.unreadMessagesCount?.toString() || "0", icon: MessageSquare },
    { labelFr: "Abonnés newsletter", labelEn: "Newsletter Subscribers", value: statsData?.subscribersCount?.toString() || "0", icon: Users },
  ];

  // Affiche rien si pas authentifié encore
  if (!isAuthenticated || !admin) return null;

  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader className="p-4 border-b border-sidebar-border">
            <div className="font-heading font-bold text-lg">
              {t("Administration", "Administration")}
            </div>
          </SidebarHeader>

          <SidebarContent className="p-2">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    onClick={() => setLocation(item.href)}
                    className={location === item.href ? "bg-sidebar-accent" : ""}
                    data-testid={`nav-${item.href.split("/").pop()}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{t(item.labelFr, item.labelEn)}</span>
                    {item.badge && (
                      <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                        {item.badge}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-2 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t("Déconnexion", "Logout")}
            </Button>
          </SidebarFooter>
        </Sidebar>

        {/* Contenu principal */}
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b border-border gap-4">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="relative" data-testid="button-notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </Button>
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-heading font-bold mb-8">
                {t("Tableau de bord", "Dashboard")}
              </h1>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsLoading
                  ? [1, 2, 3, 4].map((i) => (
                      <Card key={i} className="p-6 animate-pulse">
                        <div className="flex items-center justify-between mb-2">
                          <div className="w-8 h-8 rounded bg-muted" />
                          <div className="h-8 w-16 bg-muted rounded" />
                        </div>
                        <div className="h-4 bg-muted rounded w-24" />
                      </Card>
                    ))
                  : stats.map((stat, index) => (
                      <Card key={index} className="p-6" data-testid={`stat-${index}`}>
                        <div className="flex items-center justify-between mb-2">
                          <stat.icon className="h-8 w-8 text-primary" />
                          <div className="text-3xl font-heading font-bold">{stat.value}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {t(stat.labelFr, stat.labelEn)}
                        </div>
                      </Card>
                    ))}
              </div>

              {/* Messages et dernières stats */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h2 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {t("Messages récents", "Recent Messages")}
                  </h2>
                  <div className="space-y-3">
                    {messagesLoading
                      ? [1, 2, 3].map((i) => (
                          <div key={i} className="p-3 rounded-lg bg-muted/50 animate-pulse">
                            <div className="h-4 bg-muted rounded mb-2 w-24" />
                            <div className="h-3 bg-muted rounded w-full" />
                          </div>
                        ))
                      : messagesData && messagesData.length > 0
                      ? messagesData.slice(0, 3).map((message, i) => (
                          <div key={message.id} className="p-3 rounded-lg bg-muted/50" data-testid={`message-${i}`}>
                            <div className="font-medium text-sm mb-1">{message.name}</div>
                            <div className="text-sm text-muted-foreground line-clamp-2">
                              {message.message}
                            </div>
                          </div>
                        ))
                      : (
                        <div className="text-sm text-muted-foreground text-center py-4">
                          {t("Aucun message", "No messages")}
                        </div>
                      )}
                  </div>
                </Card>

                <Card className="p-6">
                  <h2 className="text-xl font-heading font-semibold mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {t("Dernière statistique", "Latest Stats")}
                  </h2>
                  <div className="space-y-3">
                    {statsLoading ? (
                      <>
                        <div className="p-3 rounded-lg bg-muted/50 animate-pulse">
                          <div className="h-4 bg-muted rounded mb-2 w-24" />
                          <div className="h-6 bg-muted rounded w-16" />
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 animate-pulse">
                          <div className="h-4 bg-muted rounded mb-2 w-24" />
                          <div className="h-6 bg-muted rounded w-16" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <div className="text-sm font-medium mb-1">
                            {t("Total des projets", "Total Projects")}
                          </div>
                          <div className="text-2xl font-bold">
                            {statsData?.projectsCount || 0}
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <div className="text-sm font-medium mb-1">
                            {t("Total des abonnés", "Total Subscribers")}
                          </div>
                          <div className="text-2xl font-bold">
                            {statsData?.subscribersCount || 0}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
