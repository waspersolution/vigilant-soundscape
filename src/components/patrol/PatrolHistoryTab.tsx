
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { PatrolSession } from "@/types";
import { formatDistanceToNow, format, parseISO } from "date-fns";
import { AlertTriangle, Clock, MapPin, Shield } from "lucide-react";

interface PatrolHistoryTabProps {
  pastPatrols: PatrolSession[];
  calculateDuration: (startTime: string, endTime?: string) => string;
}

export default function PatrolHistoryTab({ pastPatrols, calculateDuration }: PatrolHistoryTabProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Previous Patrols</CardTitle>
        <CardDescription>History of completed patrols</CardDescription>
      </CardHeader>
      <CardContent>
        {pastPatrols.length > 0 ? (
          <ScrollArea className="h-64">
            <div className="space-y-4">
              {pastPatrols.map((patrol) => (
                <div key={patrol.id} className="p-3 border rounded-md">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        {format(parseISO(patrol.startTime), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <Badge 
                      variant={patrol.status === 'completed' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {patrol.status === 'completed' ? 'Completed' : 'Interrupted'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Time:</span>
                    </div>
                    <div>
                      {format(parseISO(patrol.startTime), 'h:mm a')} - 
                      {patrol.endTime ? format(parseISO(patrol.endTime), ' h:mm a') : ' --'}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Points:</span>
                    </div>
                    <div>{patrol.routeData?.length || 0} locations</div>
                    
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Checks missed:</span>
                    </div>
                    <div>{patrol.missedAwakeChecks}</div>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                    Duration: {calculateDuration(patrol.startTime, patrol.endTime)}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="rounded-md border bg-muted/30 p-8 text-center">
            <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium">No patrol history</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your completed patrols will appear here
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
