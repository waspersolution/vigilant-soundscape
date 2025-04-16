
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

interface LoginFormProps {
  onForgotPasswordClick?: () => void;
  onSuperAdminSignup?: () => void; // New prop for super admin signup
}

export default function LoginForm({ onForgotPasswordClick, onSuperAdminSignup }: LoginFormProps) {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // Check if this is the first user (super admin creation)
      if (email === "wasperstore@gmail.com" && password === "Azeezwosilat1986") {
        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: 'Azeez Wosilat'
            }
          }
        });

        if (signUpError) throw signUpError;
        
        // Trigger super admin function after signup
        await supabase.rpc('create_super_admin');
        
        onSuperAdminSignup?.(); // Optional callback
        return;
      }

      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
      console.error(err);
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
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {onForgotPasswordClick && (
                <Button
                  type="button"
                  variant="link"
                  className="px-0 font-normal"
                  onClick={onForgotPasswordClick}
                  disabled={isLoading}
                >
                  Forgot password?
                </Button>
              )}
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={handleCommunityRegistration}
            className="text-secondary hover:underline"
            disabled={isLoading}
          >
            Register your community
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
