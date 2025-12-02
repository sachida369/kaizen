import { Switch, Route } from "wouter";
import { useEffect, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AppSidebar } from "@/components/app-sidebar";
import { SplashScreen } from "@/components/splash-screen";
import { useAuth } from "@/lib/useAuth";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import VacanciesPage from "@/pages/vacancies";
import VacancyFormPage from "@/pages/vacancy-form";
import CandidatesPage from "@/pages/candidates";
import CandidateFormPage from "@/pages/candidate-form";
import CampaignsPage from "@/pages/campaigns";
import CampaignFormPage from "@/pages/campaign-form";
import CallsPage from "@/pages/calls";
import SettingsPage from "@/pages/settings";
import AdminSettingsPage from "@/pages/admin-settings";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import ForgotPasswordPage from "@/pages/forgot-password";
import ResetPasswordPage from "@/pages/reset-password";
import FeaturesPage from "@/pages/features";
import PricingPage from "@/pages/pricing";
import SecurityPage from "@/pages/security";
import AboutPage from "@/pages/about";
import BlogPage from "@/pages/blog";
import CareersPage from "@/pages/careers";
import PrivacyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";
import ContactPage from "@/pages/contact";

function AppContent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  // Show loading state while checking auth
  if (isLoading) {
    return <div className="w-full h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2">Loading...</h2>
      </div>
    </div>;
  }

  // If authenticated, show full app with sidebar
  if (isAuthenticated && user) {
    return (
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex flex-col h-screen w-full">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <AppSidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <main className="flex-1 overflow-auto">
                <Switch>
                  <Route path="/" component={Dashboard} />
                  <Route path="/vacancies" component={VacanciesPage} />
                  <Route path="/vacancies/new" component={VacancyFormPage} />
                  <Route path="/vacancies/:id" component={VacancyFormPage} />
                  <Route path="/candidates" component={CandidatesPage} />
                  <Route path="/candidates/new" component={CandidateFormPage} />
                  <Route path="/candidates/:id" component={CandidateFormPage} />
                  <Route path="/campaigns" component={CampaignsPage} />
                  <Route path="/campaigns/new" component={CampaignFormPage} />
                  <Route path="/campaigns/:id" component={CampaignFormPage} />
                  <Route path="/calls" component={CallsPage} />
                  <Route path="/settings" component={SettingsPage} />
                  <Route path="/admin-settings" component={AdminSettingsPage} />
                  <Route path="/features" component={FeaturesPage} />
                  <Route path="/pricing" component={PricingPage} />
                  <Route path="/security" component={SecurityPage} />
                  <Route path="/about" component={AboutPage} />
                  <Route path="/blog" component={BlogPage} />
                  <Route path="/careers" component={CareersPage} />
                  <Route path="/privacy" component={PrivacyPage} />
                  <Route path="/terms" component={TermsPage} />
                  <Route path="/contact" component={ContactPage} />
                  <Route component={NotFound} />
                </Switch>
              </main>
            </div>
          </div>
          <Footer />
        </div>
      </SidebarProvider>
    );
  }

  // Not authenticated - show public pages and auth
  return (
    <div className="flex flex-col h-screen w-full">
      <Header />
      <main className="flex-1 overflow-auto">
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/forgot-password" component={ForgotPasswordPage} />
          <Route path="/reset-password" component={ResetPasswordPage} />
          <Route path="/features" component={FeaturesPage} />
          <Route path="/pricing" component={PricingPage} />
          <Route path="/security" component={SecurityPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/blog" component={BlogPage} />
          <Route path="/careers" component={CareersPage} />
          <Route path="/privacy" component={PrivacyPage} />
          <Route path="/terms" component={TermsPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="*">{() => <LoginPage />}</Route>
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="kaizen-theme">
        <TooltipProvider>
          <SplashScreen />
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
