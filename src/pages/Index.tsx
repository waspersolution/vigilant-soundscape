
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    console.log("Index page - Auth state:", { isAuthenticated, isLoading });
    
    if (!isLoading) {
      if (isAuthenticated) {
        console.log("User is authenticated, navigating to home page");
        navigate("/", { replace: true });
      } else {
        console.log("User is not authenticated, navigating to auth page");
        navigate("/auth", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}
