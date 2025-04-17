
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AuditLogs() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
          <CardDescription>
            Track all platform activity and administrative actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <Badge variant="outline" className="mb-2">Coming Soon</Badge>
            <h3 className="text-lg font-medium">Audit Logs Dashboard</h3>
            <p className="text-muted-foreground mt-2">
              This feature will provide comprehensive logging of all platform activities,
              including user actions, admin operations, alerts, and system events.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
