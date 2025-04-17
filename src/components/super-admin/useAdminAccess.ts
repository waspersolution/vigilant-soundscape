
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useAdminAccess() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [accessChecked, setAccessChecked] = useState(false);

  // Force update user role to super_admin on first load
  useEffect(() => {
    const forceUpdateSuperAdminRole = async () => {
      if (user?.email === "wasperstore@gmail.com") {
        console.log("SuperAdminDashboard - Forcing super_admin role update");
        try {
          const { error } = await supabase.auth.updateUser({
            data: { 
              role: 'super_admin',
              full_name: 'Azeez Wosilat'
            }
          });
          
          if (error) {
            console.error("Failed to update super admin role:", error);
          } else {
            console.log("Super admin role enforced successfully");
            
            // Refresh session to get updated metadata
            const { data } = await supabase.auth.refreshSession();
            if (data.session) {
              console.log("Session refreshed with updated role");
              
              // Force page reload to ensure all components have the latest user data
              window.location.reload(); 
            }
          }
        } catch (err) {
          console.error("Error enforcing super admin role:", err);
        }
      }
    };
    
    if (!isLoading && user?.email === "wasperstore@gmail.com" && user.role !== "super_admin") {
      console.log("SuperAdminDashboard - User email matched but role is not super_admin, enforcing...");
      forceUpdateSuperAdminRole();
    }
  }, [isLoading, user]);

  // Redirect if not a super admin
  useEffect(() => {
    console.log("SuperAdminDashboard - Auth check starting");
    console.log("SuperAdminDashboard - User:", user);
    console.log("SuperAdminDashboard - User role:", user?.role);
    console.log("SuperAdminDashboard - User email:", user?.email);
    console.log("SuperAdminDashboard - isLoading:", isLoading);
    
    // Only run access check once authentication has loaded
    if (!isLoading) {
      // Special case for wasperstore@gmail.com - always allow access
      if (user?.email === "wasperstore@gmail.com") {
        console.log("SuperAdminDashboard - Special super admin email detected, allowing access");
        setAccessChecked(true);
      }
      // Check role-based access
      else if (user?.role === "super_admin") {
        console.log("SuperAdminDashboard - User has super_admin role, allowing access");
        setAccessChecked(true);
      } 
      else {
        console.log("SuperAdminDashboard - User is NOT a super admin, redirecting to home");
        console.log("SuperAdminDashboard - User email:", user?.email);
        console.log("SuperAdminDashboard - User role:", user?.role);
        toast.error("You don't have permission to access this page");
        navigate("/home", { replace: true });
      }
    }
  }, [user, isLoading, navigate]);

  return { isLoading, accessChecked };
}
