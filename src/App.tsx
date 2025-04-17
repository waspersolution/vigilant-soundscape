
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Toaster } from "sonner";

import AppLayout from "@/components/layout/AppLayout";
import Auth from "@/pages/Auth";
import Home from "@/pages/Home";
import Map from "@/pages/Map";
import Patrol from "@/pages/Patrol";
import Alerts from "@/pages/Alerts";
import Community from "@/pages/Community";
import Communication from "@/pages/Communication";
import Settings from "@/pages/Settings";
import SuperAdminDashboard from "@/pages/SuperAdminDashboard";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/contexts/auth";
import { LocationProvider } from "@/contexts/LocationContext";
import { AlertProvider } from "@/contexts/AlertContext";
import Voice from "./pages/Voice";
import Index from "./pages/Index";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LocationProvider>
          <AlertProvider>
            <Toaster position="top-right" />
            <RouterProvider
              router={createBrowserRouter([
                {
                  path: "/",
                  element: <Index />
                },
                {
                  path: "/home",
                  element: <AppLayout><Home /></AppLayout>,
                  errorElement: <NotFound />,
                },
                {
                  path: "/map",
                  element: <AppLayout><Map /></AppLayout>,
                },
                {
                  path: "/patrol",
                  element: <AppLayout><Patrol /></AppLayout>,
                },
                {
                  path: "/alerts",
                  element: <AppLayout><Alerts /></AppLayout>,
                },
                {
                  path: "/community",
                  element: <AppLayout><Community /></AppLayout>,
                },
                {
                  path: "/communication",
                  element: <AppLayout><Communication /></AppLayout>,
                },
                {
                  path: "/communication/:channelId",
                  element: <AppLayout><Communication /></AppLayout>,
                },
                {
                  path: "/settings",
                  element: <AppLayout><Settings /></AppLayout>,
                },
                {
                  path: "/voice",
                  element: <AppLayout><Voice /></AppLayout>,
                },
                {
                  path: "/super-admin",
                  element: <AppLayout><SuperAdminDashboard /></AppLayout>,
                },
                {
                  path: "/auth",
                  element: <Auth />,
                },
                {
                  path: "*",
                  element: <NotFound />,
                },
              ])}
            />
          </AlertProvider>
        </LocationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
