
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SystemAnalytics() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Analytics</CardTitle>
          <CardDescription>
            Platform-wide analytics and statistics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <Badge variant="outline" className="mb-2">Coming Soon</Badge>
            <h3 className="text-lg font-medium">System Analytics Dashboard</h3>
            <p className="text-muted-foreground mt-2">
              This feature will provide comprehensive analytics on distress alerts, communication usage,
              community registrations, and other platform metrics.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
