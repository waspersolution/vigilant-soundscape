
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import AlertsList from "@/components/alerts/AlertsList";
import EmergencyButton from "@/components/alerts/EmergencyButton";

export default function Alerts() {
  const location = useLocation();
  
  useEffect(() => {
    // Scroll to top when navigating to this page
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Alerts Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and respond to community security alerts
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-12rem)]">
        <AlertsList />
      </ScrollArea>
      
      <EmergencyButton />
    </div>
  );
}
