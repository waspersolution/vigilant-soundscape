
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useAlert } from "@/contexts/alert"; // Update to use the correct import path
import { cn } from "@/lib/utils";
import {
  Home,
  Map,
  AlertTriangle,
  Radio,
  Settings,
  LogOut,
  Menu,
  X,
  Siren,
  Bell
} from "lucide-react";

export default function MobileNav() {
  const location = useLocation();
  const { logout } = useAuth();
  const { activeAlerts } = useAlert();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const hasActiveAlerts = activeAlerts.length > 0;

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Map",
      path: "/map",
      icon: <Map className="h-5 w-5" />,
    },
    {
      name: "Alerts",
      path: "/alerts",
      icon: <AlertTriangle className="h-5 w-5" />,
      alert: hasActiveAlerts,
      alertCount: activeAlerts.length
    },
    {
      name: "Patrol",
      path: "/patrol",
      icon: <Radio className="h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="grid h-full grid-cols-5 mx-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "inline-flex flex-col items-center justify-center px-1 relative",
                location.pathname === item.path
                  ? "text-primary"
                  : "text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
              )}
            >
              {item.alert && (
                <span className="absolute top-1 right-4 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                </span>
              )}
              {item.icon}
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Emergency Button */}
      <div className="fixed bottom-24 right-4 z-50">
        <Button 
          size="lg" 
          variant="destructive" 
          className="rounded-full h-16 w-16 shadow-lg animate-pulse-alert"
          onClick={() => {
            // Open emergency modal
            console.log("Emergency button pressed");
          }}
        >
          <Siren className="h-8 w-8" />
        </Button>
      </div>

      {/* Top Navigation Bar */}
      <header className="fixed top-0 left-0 z-50 w-full bg-primary text-primary-foreground h-14 flex items-center justify-between px-4 shadow-md">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
          <h1 className="ml-2 text-xl font-bold">VigilPro</h1>
        </div>
        
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-6 w-6" />
          {hasActiveAlerts && (
            <span className="absolute top-1 right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
            </span>
          )}
        </Button>
      </header>

      {/* Side Menu (slide in from left) */}
      <div
        className={cn(
          "fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="absolute inset-0 bg-black/50" onClick={toggleMenu} />
        <div className="absolute top-0 left-0 h-full w-3/4 max-w-xs bg-background p-4 shadow-lg transform transition-transform duration-300 ease-in-out">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">VigilPro Security</h2>
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center space-x-2 p-2 rounded-md transition-colors",
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
                {item.alertCount ? (
                  <span className="ml-auto bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {item.alertCount}
                  </span>
                ) : null}
              </Link>
            ))}
            
            <hr className="my-4" />
            
            <Button
              variant="ghost"
              className="flex items-center space-x-2 w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
