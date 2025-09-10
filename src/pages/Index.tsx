import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { LandingPage } from "@/components/LandingPage";
import { WasteScanner } from "@/components/WasteScanner";
import { Dashboard } from "@/components/Dashboard";
import { RewardsPage } from "@/components/RewardsPage";

const Index = () => {
  const [currentView, setCurrentView] = useState("home");

  const renderCurrentView = () => {
    switch (currentView) {
      case "home":
        return <LandingPage onGetStarted={() => setCurrentView("scan")} />;
      case "scan":
        return <WasteScanner />;
      case "dashboard":
        return <Dashboard />;
      case "rewards":
        return <RewardsPage />;
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

export default Index;
