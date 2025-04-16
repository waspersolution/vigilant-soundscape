import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AlertProvider } from "@/contexts/AlertContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { AlertNotification } from "@/components/alerts/AlertNotification";
import AppLayout from "@/components/layout/AppLayout";
import Auth from "@/pages/Auth";
import Home from "@/pages/Home";
import Alerts from "@/pages/Alerts";
import Map from "@/pages/Map";
import Patrol from "@/pages/Patrol";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";

const queryClient = new QueryClient();

const AuthenticatedApp = () => {
  return (
    <LocationProvider>
      <AlertProvider>
        <AlertNotification />
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/map" element={<Map />} />
            <Route path="/patrol" element={<Patrol />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </AlertProvider>
    </LocationProvider>
  );
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  console.log("ProtectedRoute - Auth state:", { isAuthenticated, isLoading });
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to auth page");
    return <Navigate to="/auth" replace />;
  }
  
  console.log("User is authenticated, showing protected content");
  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/index" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <AuthenticatedApp />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
