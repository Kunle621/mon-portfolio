// src/components/admin/admin-pages/DashboardPage.tsx
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { adminStatsAPI, adminMessagesAPI } from "@/lib/api";
import { Card } from "@/components/ui/card";
import {
  FolderKanban,
  FileText,
  MessageSquare,
  Users,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminStats {
  projectsCount: number;
  postsCount: number;
  unreadMessagesCount: number;
  subscribersCount: number;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function DashboardPage() {
  const { t } = useLanguage();
  const { token } = useAuth();

  const { data: statsData, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
    queryFn: () => adminStatsAPI.get(token!),
    enabled: !!token,
  });

  const { data: messagesData, isLoading: messagesLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/admin/messages"],
    queryFn: () => adminMessagesAPI.getAll(token!),
    enabled: !!token,
  });

  const unreadCount = messagesData?.filter((m) => !m.read).length || 0;

  const stats = [
    { labelFr: "Projets publiés", labelEn: "Published Projects", value: statsData?.projectsCount?.toString() || "0", icon: FolderKanban },
    { labelFr: "Articles de blog", labelEn: "Blog Posts", value: statsData?.postsCount?.toString() || "0", icon: FileText },
    { labelFr: "Messages non lus", labelEn: "Unread Messages", value: statsData?.unreadMessagesCount?.toString() || "0", icon: MessageSquare },
    { labelFr: "Abonnés newsletter", labelEn: "Newsletter Subscribers", value: statsData?.subscribersCount?.toString() || "0", icon: Users },
  ];

  return (
    <>
      <header className="flex items-center justify-between p-4 border-b border-border gap-4">
        <div className="text-xl font-heading font-bold">
          {t("Tableau de bord", "Dashboard")}
        </div>
        <Button size="icon" variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          )}
        </Button>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
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
                  <Card key={index} className="p-6">
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
                      <div key={message.id} className="p-3 rounded-lg bg-muted/50">
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
    </>
  );
}