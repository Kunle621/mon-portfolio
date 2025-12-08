// src/App.tsx
import { Switch, Route } from "wouter";
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

function Router() {
  return (
    <Switch>
      {/* Routes Publiques */}
      <Route path="/" component={HomePage} />
      <Route path="/blog" component={BlogPage} />
      
      {/* Route Login Admin (Doit être placée AVANT les autres routes admin) */}
      <Route path="/admin/login" component={AdminLogin} />

      {/* 
         Route Admin Globale 
         Le motif "/admin/*?" capture "/admin" ET "/admin/n'importe-quoi"
         C'est AdminRouter qui va décider si on redirige ou si on affiche le dashboard
      */}
      <Route path="/admin/*?" component={AdminRouter} />

      {/* Page 404 */}
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