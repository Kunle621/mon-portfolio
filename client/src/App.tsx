// src/App.tsx
import { Switch, Route } from "wouter";
import { useEffect, ReactNode } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import HomePage from "@/pages/HomePage";
import BlogPage from "@/pages/BlogPage";
import AdminLogin from "@/pages/AdminLogin";
import AdminRouter from "@/pages/AdminRouter";
import NotFound from "@/pages/not-found";

// 🔁 Composant de redirection pour /admin
function AdminHomeRedirect(): null {
  const [, setLocation] = require("wouter").useLocation();
  useEffect(() => {
    setLocation("/admin/dashboard");
  }, [setLocation]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/admin/login" component={AdminLogin} />
      {/* ✅ Redirige /admin vers le dashboard */}
      <Route path="/admin" component={AdminHomeRedirect} />
      {/* ✅ Gère toutes les sous-routes admin */}
      <Route path="/admin/*" component={AdminRouter} />
      {/* ✅ Page 404 pour les routes inconnues */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;