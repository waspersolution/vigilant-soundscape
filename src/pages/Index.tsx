
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
        // Special handling for super admin
        if (user?.role === "super_admin" || user?.email === "wasperstore@gmail.com") {
          console.log("User is super admin, giving option to navigate to super admin dashboard");
          toast.success("Logged in as Super Admin");
          
          // Ask if they want to go to super admin dashboard or home
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
