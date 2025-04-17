
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import ErrorPage from "@/components/error/ErrorPage";
import { AuthProvider } from "@/contexts/auth";
import { LocationProvider } from "@/contexts/LocationContext";
import { AlertProvider } from "@/contexts/AlertContext";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import Voice from "./pages/Voice";
import Index from "./pages/Index";
import ErrorBoundary from "./components/error/ErrorBoundary";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <LocationProvider>
              <AlertProvider>
                <Toaster position="top-right" />
                <RouterProvider
                  router={createBrowserRouter([
                    {
                      path: "/",
                      element: <Index />,
                      errorElement: <ErrorPage />
                    },
                    {
                      path: "/home",
                      element: <AppLayout><Home /></AppLayout>,
                      errorElement: <ErrorPage />
                    },
                    {
                      path: "/map",
                      element: <AppLayout><Map /></AppLayout>,
                      errorElement: <ErrorPage />
                    },
                    {
                      path: "/patrol",
                      element: <AppLayout><Patrol /></AppLayout>,
                      errorElement: <ErrorPage />
                    },
                    {
                      path: "/alerts",
                      element: <AppLayout><Alerts /></AppLayout>,
                      errorElement: <ErrorPage />
                    },
                    {
                      path: "/community",
                      element: <AppLayout><Community /></AppLayout>,
                      errorElement: <ErrorPage />
                    },
                    {
                      path: "/communication",
                      element: <AppLayout><Communication /></AppLayout>,
                      errorElement: <ErrorPage />
                    },
                    {
                      path: "/communication/:channelId",
                      element: <AppLayout><Communication /></AppLayout>,
                      errorElement: <ErrorPage />
                    },
                    {
                      path: "/settings",
                      element: <AppLayout><Settings /></AppLayout>,
                      errorElement: <ErrorPage />
                    },
                    {
                      path: "/voice",
                      element: <AppLayout><Voice /></AppLayout>,
                      errorElement: <ErrorPage />
                    },
                    {
                      path: "/super-admin",
                      element: <AppLayout><SuperAdminDashboard /></AppLayout>,
                      errorElement: <ErrorPage />
                    },
                    {
                      path: "/auth",
                      element: <Auth />,
                      errorElement: <ErrorPage />
                    },
                    {
                      path: "*",
                      element: <NotFound />,
                      errorElement: <ErrorPage />
                    },
                  ])}
                />
              </AlertProvider>
            </LocationProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
