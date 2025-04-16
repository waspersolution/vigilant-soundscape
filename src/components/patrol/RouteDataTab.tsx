
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PatrolSession } from "@/types";
import { formatDistanceToNow, parseISO } from "date-fns";
import { MapPin } from "lucide-react";

interface RouteDataTabProps {
  activePatrol: PatrolSession | null;
}

export default function RouteDataTab({ activePatrol }: RouteDataTabProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Route Data</CardTitle>
        <CardDescription>Location history for current patrol</CardDescription>
      </CardHeader>
      <CardContent>
        {activePatrol && activePatrol.routeData && activePatrol.routeData.length > 0 ? (
          <ScrollArea className="h-64">
            <div className="space-y-3">
              {[...activePatrol.routeData].reverse().map((loc, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-2 border-b last:border-0"
                >
                  <div className="p-1 rounded-full bg-primary/10">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm">
                      {loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(parseISO(loc.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="rounded-md border bg-muted/30 p-8 text-center">
            <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium">No route data available</p>
            <p className="text-sm text-muted-foreground mt-1">
              {activePatrol 
                ? "Route tracking has started. Move around to record locations." 
                : "Start a patrol to begin tracking your route"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
