
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CommunicationMonitoring() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Communication Monitoring</CardTitle>
          <CardDescription>
            Monitor voice and text communications across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <Badge variant="outline" className="mb-2">Coming Soon</Badge>
            <h3 className="text-lg font-medium">Communication Monitoring Dashboard</h3>
            <p className="text-muted-foreground mt-2">
              This feature will allow monitoring of all active chatrooms and walkie-talkie communications,
              as well as auditing flagged messages and keywords.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
