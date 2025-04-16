
import SecurityMap from "@/components/maps/SecurityMap";
import EmergencyButton from "@/components/alerts/EmergencyButton";

export default function Map() {
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Security Map</h1>
        <p className="text-muted-foreground">
          Real-time community monitoring and alerts
        </p>
      </div>

      <SecurityMap />
      
      <EmergencyButton />
    </div>
  );
}
