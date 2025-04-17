
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useAuth();
  
  // Force update super admin role if needed
  useEffect(() => {
    const updateSuperAdminIfNeeded = async () => {
      if (user?.email === "wasperstore@gmail.com" && user.role !== "super_admin") {
        console.log("Index - User is the super admin email but role isn't super_admin, updating...");
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
            console.log("Super admin role enforced successfully from Index page");
            
            // Refresh session to get updated metadata
            await supabase.auth.refreshSession();
            
            // Force page reload to ensure new role is applied everywhere
            window.location.reload();
          }
        } catch (err) {
          console.error("Error enforcing super admin role:", err);
        }
      }
    };
    
    if (!isLoading && user) {
      updateSuperAdminIfNeeded();
    }
  }, [isLoading, user]);
  
  useEffect(() => {
    console.log("Index page - Auth state:", { 
      isAuthenticated, 
      isLoading, 
      userEmail: user?.email,
      userRole: user?.role 
    });
    
    if (!isLoading) {
      if (isAuthenticated) {
        // Special handling for super admin email - always go to super admin regardless of role
        if (user?.email === "wasperstore@gmail.com") {
          console.log("User has super admin email, redirecting to super admin dashboard");
          toast.success("Logged in as Super Admin");
          navigate("/super-admin", { replace: true });
        }
        // Role-based handling
        else if (user?.role === "super_admin") {
          console.log("User has super_admin role, redirecting to super admin dashboard");
          toast.success("Logged in as Super Admin");
          navigate("/super-admin", { replace: true });
        } else {
          console.log("User is authenticated but not super admin, navigating to home page");
          navigate("/home", { replace: true });
        }
      } else {
        console.log("User is not authenticated, navigating to auth page");
        navigate("/auth", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}
