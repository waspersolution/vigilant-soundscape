
import { useAdminAccess } from "@/components/super-admin/useAdminAccess";
import { SuperAdminLoadingState } from "@/components/super-admin/SuperAdminLoadingState";
import { SuperAdminTabs } from "@/components/super-admin/SuperAdminTabs";

export default function SuperAdminDashboard() {
  const { isLoading, accessChecked } = useAdminAccess();

  // Show loading state while checking authentication
  if (isLoading || !accessChecked) {
    return <SuperAdminLoadingState />;
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-gradient">
          Super Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage all communities, users, and platform operations
        </p>
      </div>

      <SuperAdminTabs />
    </div>
  );
}
