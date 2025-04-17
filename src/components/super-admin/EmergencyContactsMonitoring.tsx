
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function EmergencyContactsMonitoring() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Emergency Contact Usage</CardTitle>
          <CardDescription>
            Monitor emergency contact usage across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <Badge variant="outline" className="mb-2">Coming Soon</Badge>
            <h3 className="text-lg font-medium">Emergency Contact Usage Dashboard</h3>
            <p className="text-muted-foreground mt-2">
              This feature will track how many distress messages have been sent to emergency contacts
              and provide analytics on patterns of usage.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
