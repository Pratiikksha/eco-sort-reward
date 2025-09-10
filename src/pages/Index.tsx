import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { LandingPage } from "@/components/LandingPage";
import { WasteScanner } from "@/components/WasteScanner";
import { Dashboard } from "@/components/Dashboard";
import { RewardsPage } from "@/components/RewardsPage";
import { CollectionPage } from "@/components/CollectionPage";
import { AuthPage } from "@/components/AuthPage";
import { AuthProvider, useAuth } from "@/hooks/useAuth";

const AppContent = () => {
  const [currentView, setCurrentView] = useState("home");
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    if (!user) {
      if (currentView === "auth") {
        return <AuthPage onAuthSuccess={() => setCurrentView("home")} />;
      }
      return <LandingPage onGetStarted={() => setCurrentView("auth")} />;
    }

    switch (currentView) {
      case "home":
        return <LandingPage onGetStarted={() => setCurrentView("scan")} />;
      case "scan":
        return <WasteScanner />;
      case "dashboard":
        return <Dashboard />;
      case "rewards":
        return <RewardsPage />;
      case "collections":
        return <CollectionPage />;
      case "auth":
        return <AuthPage onAuthSuccess={() => setCurrentView("home")} />;
      default:
        return <LandingPage onGetStarted={() => setCurrentView("scan")} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      {renderCurrentView()}
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
