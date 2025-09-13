import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Leaf, Camera, BarChart3, Gift, Menu, X, Truck, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Navigation = ({ currentView, onViewChange }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navItems = [
    { id: "home", label: "Home", icon: Leaf },
    { id: "scan", label: "Scan Waste", icon: Camera },
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "rewards", label: "Rewards", icon: Gift },
    { id: "collections", label: "Collections", icon: Truck },
  ];

  const handleSignOut = async () => {
    await signOut();
    onViewChange("home");
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-card border-b border-border shadow-gentle sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-eco rounded-lg">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Sortify</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {user && navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "eco" : "ghost"}
                  size="sm"
                  onClick={() => onViewChange(item.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
            
            {!user ? (
              <Button
                variant="eco"
                size="sm"
                onClick={() => onViewChange("auth")}
                className="flex items-center space-x-2"
              >
                <span>Sign In</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {user && navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "eco" : "ghost"}
                    onClick={() => {
                      onViewChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="justify-start space-x-2 w-full"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
              
              {!user ? (
                <Button
                  variant="eco"
                  onClick={() => {
                    onViewChange("auth");
                    setIsMobileMenuOpen(false);
                  }}
                  className="justify-start space-x-2 w-full"
                >
                  <span>Sign In</span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="justify-start space-x-2 w-full"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};