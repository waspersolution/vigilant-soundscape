
import React from "react";

export function SuperAdminLoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      <div className="ml-4">Verifying super admin access...</div>
    </div>
  );
}
