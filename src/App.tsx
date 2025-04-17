
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
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocationProvider } from "@/contexts/LocationContext";
import { AlertProvider } from "@/contexts/AlertContext";
import Voice from "./pages/Voice";

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
                  element: <AppLayout><Outlet /></AppLayout>,
                  errorElement: <NotFound />,
                  children: [
                    { path: "/", element: <Home /> },
                    { path: "/map", element: <Map /> },
                    { path: "/patrol", element: <Patrol /> },
                    { path: "/alerts", element: <Alerts /> },
                    { path: "/community", element: <Community /> },
                    { path: "/settings", element: <Settings /> },
                    { path: "/voice", element: <Voice /> },
                  ],
                },
                {
                  path: "/auth",
                  element: <Auth />,
                },
                {
                  path: "/*",
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
