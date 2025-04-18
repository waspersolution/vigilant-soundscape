
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import LoginFormFields from "./LoginFormFields";
import SuperAdminHandler from "./SuperAdminHandler";

interface LoginFormProps {
  onForgotPasswordClick?: () => void;
  onSuperAdminSignup?: () => void;
}

export default function LoginForm({ onForgotPasswordClick, onSuperAdminSignup }: LoginFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuperAdminProcessing, setIsSuperAdminProcessing] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(30);

  useEffect(() => {
    // Check if there are any auth-related URL parameters
    const url = new URL(window.location.href);
    const errorParam = url.searchParams.get("error");
    const errorDescriptionParam = url.searchParams.get("error_description");
    
    if (errorParam && errorDescriptionParam) {
      setError(`Auth error: ${errorDescriptionParam}`);
      console.error("Auth redirect error:", errorParam, errorDescriptionParam);
    }
  }, []);

  // Countdown timer for rate limit cooldown
  useEffect(() => {
    let timer: number | undefined;
    if (rateLimited && cooldownTime > 0) {
      timer = window.setInterval(() => {
        setCooldownTime(prev => prev - 1);
      }, 1000);
    } else if (cooldownTime <= 0) {
      setRateLimited(false);
      setCooldownTime(30);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [rateLimited, cooldownTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (rateLimited) {
      setError(`Please wait ${cooldownTime} seconds before trying again`);
      return;
    }

    try {
      // Check if this is super admin login attempt
      if (email === "wasperstore@gmail.com" && password === "Azeezwosilat1986") {
        setIsSuperAdminProcessing(true);
        
        await SuperAdminHandler.handleSuperAdmin(
          email, 
          password, 
          onSuperAdminSignup,
          () => setIsSuperAdminProcessing(false),
          (errorMsg) => {
            setError(errorMsg);
            if (errorMsg.includes("Rate limit") || errorMsg.includes("security purposes")) {
              setRateLimited(true);
            }
          }
        );
        
        return;
      }

      // Regular user login
      setIsLoading(true);
      await login(email, password);
    } catch (err: any) {
      const errorMsg = err.message || "Invalid email or password";
      setError(errorMsg);
      console.error("Login error:", err);
      
      // Check for rate limiting errors
      if (errorMsg.includes("rate limit") || 
          errorMsg.includes("For security purposes") ||
          (err.status && err.status === 429)) {
        setRateLimited(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommunityRegistration = () => {
    window.open("https://waspersolution.com/community", "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">VigilPro Login</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your community security dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoginFormFields 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSubmit={handleSubmit}
          error={error}
          isLoading={isLoading || isSuperAdminProcessing}
          onForgotPasswordClick={onForgotPasswordClick}
          disabled={rateLimited}
        />
        
        {rateLimited && (
          <div className="mt-3 text-sm text-amber-600 dark:text-amber-400 text-center">
            Too many attempts. Please wait {cooldownTime} seconds before trying again.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={handleCommunityRegistration}
            className="text-secondary hover:underline"
            disabled={isLoading || isSuperAdminProcessing}
          >
            Register your community
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
