
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SecurityTracking() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security Personnel Tracking</CardTitle>
          <CardDescription>
            Track and monitor security personnel across all communities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <Badge variant="outline" className="mb-2">Coming Soon</Badge>
            <h3 className="text-lg font-medium">Security Personnel Tracking Dashboard</h3>
            <p className="text-muted-foreground mt-2">
              This feature will provide a live map view showing the location of on-duty security guards,
              patrol routes, and activity tracking.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
