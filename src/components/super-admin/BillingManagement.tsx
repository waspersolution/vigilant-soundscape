
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BillingManagement() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Billing & Subscription Management</CardTitle>
          <CardDescription>
            Manage community subscriptions and billing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center">
            <Badge variant="outline" className="mb-2">Coming Soon</Badge>
            <h3 className="text-lg font-medium">Billing Management Dashboard</h3>
            <p className="text-muted-foreground mt-2">
              This feature will provide tools to manage community subscription plans,
              track usage statistics, and handle billing operations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
