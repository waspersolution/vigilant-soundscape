
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { AlertTriangle, Ban, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ErrorPage() {
  const error = useRouteError();
  
  let errorMessage = "An unexpected error occurred";
  let errorTitle = "Application Error";
  let errorIcon = <AlertTriangle className="h-8 w-8 text-destructive" />;
  
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      errorTitle = "Page Not Found";
      errorMessage = "The page you're looking for doesn't exist or has been moved.";
      errorIcon = <Ban className="h-8 w-8 text-destructive" />;
    } else {
      errorMessage = error.statusText || errorMessage;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background shield-pattern">
      <Card className="w-full max-w-md border-destructive/30 shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            {errorIcon}
            <CardTitle className="text-2xl font-bold">{errorTitle}</CardTitle>
          </div>
          <CardDescription className="text-base">
            {errorMessage}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error instanceof Error && error.stack && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-muted-foreground">Technical details</summary>
              <div className="mt-2 p-2 bg-muted/50 rounded text-xs font-mono overflow-auto max-h-40">
                {error.stack}
              </div>
            </details>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh page
          </Button>
          <Button asChild>
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Return home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
