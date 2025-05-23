
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Auth() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  
  // Check for Supabase connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        if (error) {
          console.error("Supabase connection error:", error);
          toast.error("Connection error. Please try again later.");
        } else {
          console.log("Supabase connection successful");
        }
      } catch (err) {
        console.error("Failed to connect to Supabase:", err);
        toast.error("Connection error. Please try again later.");
      }
    };
    
    checkConnection();
  }, []);
  
  // Redirect if already authenticated
  useEffect(() => {
    console.log("Auth page - Auth state:", { 
      isAuthenticated, 
      isLoading, 
      userEmail: user?.email,
      userRole: user?.role 
    });
    
    if (!isLoading && isAuthenticated) {
      console.log("User is authenticated in Auth page");
      
      // Special handling for super admin - always redirect them to super admin dashboard
      if (user?.email === "wasperstore@gmail.com") {
        console.log("Super admin email detected, redirecting to super admin dashboard");
        navigate("/super-admin", { replace: true });
      }
      // Check for super_admin role
      else if (user?.role === "super_admin") {
        console.log("Super admin role detected, redirecting to super admin dashboard");
        navigate("/super-admin", { replace: true });
      } 
      else {
        console.log("Regular user, redirecting to home");
        navigate("/home", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, user]);

  const handleSuperAdminSignup = () => {
    toast.success("Super Admin logged in successfully!");
    // Force page reload to ensure fresh authentication state
    window.location.href = "/super-admin";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only render the auth UI if not authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-muted/30 p-4">
      {/* Logo and App Title */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold">VigilPro</h1>
        <p className="text-muted-foreground">Community Security Platform</p>
      </div>

      {showForgotPassword ? (
        <ForgotPasswordForm onBackToLogin={() => setShowForgotPassword(false)} />
      ) : (
        <LoginForm 
          onForgotPasswordClick={() => setShowForgotPassword(true)}
          onSuperAdminSignup={handleSuperAdminSignup}
        />
      )}
      
      <div className="mt-8 text-sm text-muted-foreground">
        <p>
          Super Admin Login:<br />
          Email: wasperstore@gmail.com<br />
          Password: Azeezwosilat1986
        </p>
      </div>
    </div>
  );
}
