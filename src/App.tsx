
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { lazy, Suspense } from "react";

import AppLayout from "@/components/layout/AppLayout";
import ErrorPage from "@/components/error/ErrorPage";
import { AuthProvider } from "@/contexts/auth";
import { LocationProvider } from "@/contexts/LocationContext";
import { AlertProvider } from "@/contexts/AlertContext";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import ErrorBoundary from "./components/error/ErrorBoundary";

// Lazy load pages for code splitting
const Auth = lazy(() => import("@/pages/Auth"));
const Home = lazy(() => import("@/pages/Home"));
const Map = lazy(() => import("@/pages/Map"));
const Patrol = lazy(() => import("@/pages/Patrol"));
const Alerts = lazy(() => import("@/pages/Alerts"));
const Community = lazy(() => import("@/pages/Community"));
const Communication = lazy(() => import("@/pages/Communication"));
const Settings = lazy(() => import("@/pages/Settings"));
const SuperAdminDashboard = lazy(() => import("@/pages/SuperAdminDashboard"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const Voice = lazy(() => import("@/pages/Voice"));
const Index = lazy(() => import("@/pages/Index"));

// Loading component for lazy-loaded pages
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Suspense fallback={<PageLoader />}>
          <Index />
        </Suspense>
      ),
      errorElement: <ErrorPage />
    },
    {
      path: "/home",
      element: (
        <AppLayout>
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        </AppLayout>
      ),
      errorElement: <ErrorPage />
    },
    {
      path: "/map",
      element: (
        <AppLayout>
          <Suspense fallback={<PageLoader />}>
            <Map />
          </Suspense>
        </AppLayout>
      ),
      errorElement: <ErrorPage />
    },
    {
      path: "/patrol",
      element: (
        <AppLayout>
          <Suspense fallback={<PageLoader />}>
            <Patrol />
          </Suspense>
        </AppLayout>
      ),
      errorElement: <ErrorPage />
    },
    {
      path: "/alerts",
      element: (
        <AppLayout>
          <Suspense fallback={<PageLoader />}>
            <Alerts />
          </Suspense>
        </AppLayout>
      ),
      errorElement: <ErrorPage />
    },
    {
      path: "/community",
      element: (
        <AppLayout>
          <Suspense fallback={<PageLoader />}>
            <Community />
          </Suspense>
        </AppLayout>
      ),
      errorElement: <ErrorPage />
    },
    {
      path: "/communication",
      element: (
        <AppLayout>
          <Suspense fallback={<PageLoader />}>
            <Communication />
          </Suspense>
        </AppLayout>
      ),
      errorElement: <ErrorPage />
    },
    {
      path: "/communication/:channelId",
      element: (
        <AppLayout>
          <Suspense fallback={<PageLoader />}>
            <Communication />
          </Suspense>
        </AppLayout>
      ),
      errorElement: <ErrorPage />
    },
    {
      path: "/settings",
      element: (
        <AppLayout>
          <Suspense fallback={<PageLoader />}>
            <Settings />
          </Suspense>
        </AppLayout>
      ),
      errorElement: <ErrorPage />
    },
    {
      path: "/voice",
      element: (
        <AppLayout>
          <Suspense fallback={<PageLoader />}>
            <Voice />
          </Suspense>
        </AppLayout>
      ),
      errorElement: <ErrorPage />
    },
    {
      path: "/super-admin",
      element: (
        <AppLayout>
          <Suspense fallback={<PageLoader />}>
            <SuperAdminDashboard />
          </Suspense>
        </AppLayout>
      ),
      errorElement: <ErrorPage />
    },
    {
      path: "/auth",
      element: (
        <Suspense fallback={<PageLoader />}>
          <Auth />
        </Suspense>
      ),
      errorElement: <ErrorPage />
    },
    {
      path: "*",
      element: (
        <Suspense fallback={<PageLoader />}>
          <NotFound />
        </Suspense>
      ),
      errorElement: <ErrorPage />
    },
  ]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            <LocationProvider>
              <AlertProvider>
                <Toaster position="top-right" />
                <RouterProvider router={router} />
              </AlertProvider>
            </LocationProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
