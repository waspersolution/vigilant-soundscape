import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Shield, Clock, Radio } from "lucide-react";
import { PatrolSession } from "@/types";
import { formatDistanceToNow, parseISO } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function ActivePatrolsList() {
  const { user } = useAuth();
  const [activePatrols, setActivePatrols] = useState<PatrolSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch active patrols from database
    // For demo, we'll use mock data
    const fetchPatrols = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const now = new Date().toISOString();
        const mockPatrols: PatrolSession[] = [
          {
            id: "patrol-1",
            guardId: "user-123",
            guardName: "John Doe",
            communityId: "comm-123",
            startTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
            status: "active",
            routeData: [
              { latitude: 37.7749, longitude: -122.4194, timestamp: now },
              { latitude: 37.7750, longitude: -122.4190, timestamp: now }
            ],
            missedAwakeChecks: 0,
            totalDistance: 0.5,
            createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            updatedAt: now
          },
          {
            id: "patrol-2",
            guardId: "user-456",
            guardName: "Jane Smith",
            communityId: "comm-123",
            startTime: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
            status: "active",
            routeData: [
              { latitude: 37.7760, longitude: -122.4180, timestamp: now }
            ],
            missedAwakeChecks: 1,
            totalDistance: 0.3,
            createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            updatedAt: now
          }
        ];
        
        setActivePatrols(mockPatrols);
      } catch (error) {
        console.error("Error fetching active patrols:", error);
        toast.error("Failed to load active patrols");
      } finally {
        setLoading(false);
      }
    };

    fetchPatrols();
  }, []);

  return (
    <CardContent>
      {loading ? (
        <div className="flex items-center justify-center h-24">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : activePatrols.length === 0 ? (
        <div className="rounded-md border bg-muted/30 p-8 text-center">
          <Shield className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium">No active patrols</p>
          <p className="text-sm text-muted-foreground mt-1">
            Active security patrols will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activePatrols.map((patrol) => (
            <div key={patrol.id} className="p-3 border rounded-md">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="font-medium">{patrol.guardName}</span>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {formatDistanceToNow(parseISO(patrol.startTime), { addSuffix: false })}
                  </span>
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Location:</span>
                </div>
                <div>
                  {patrol.routeData && patrol.routeData.length > 0
                    ? `${patrol.routeData[patrol.routeData.length - 1].latitude.toFixed(4)}, ${patrol.routeData[patrol.routeData.length - 1].longitude.toFixed(4)}`
                    : "Unknown"}
                </div>
                
                <div className="flex items-center gap-1">
                  <Radio className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Status:</span>
                </div>
                <div>{patrol.status}</div>
              </div>
              
              <Button variant="link" className="w-full mt-2">
                View Patrol Details
              </Button>
            </div>
          ))}
        </div>
      )}
    </CardContent>
  );
}
