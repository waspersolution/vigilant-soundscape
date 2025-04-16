
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LoginFormProps {
  onForgotPasswordClick?: () => void;
  onSuperAdminSignup?: () => void; // New prop for super admin signup
}

export default function LoginForm({ onForgotPasswordClick, onSuperAdminSignup }: LoginFormProps) {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuperAdminProcessing, setIsSuperAdminProcessing] = useState(false);

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
        setIsSuperAdminProcessing(true);
        
        // Custom handling for super admin
        try {
          // First try to sign in, in case the user already exists
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (signInData.user) {
            console.log("Super admin user already exists, logged in");
            // User exists, try to run the create_super_admin RPC
            try {
              await supabase.rpc('create_super_admin');
              toast.success("Super admin role applied successfully");
            } catch (rpcError) {
              console.log("Super admin RPC error:", rpcError);
              // User might already be a super admin, continue anyway
            }
            onSuperAdminSignup?.();
            return;
          }
          
          // If user doesn't exist, create it
          if (signInError) {
            console.log("User doesn't exist, creating super admin...");
            // Manual approach to create user and profile
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  full_name: 'Azeez Wosilat'
                }
              }
            });
            
            if (signUpError) {
              throw signUpError;
            }
            
            if (signUpData.user) {
              console.log("User created:", signUpData.user.id);
              
              // Manually create profile if trigger fails
              try {
                const { error: profileError } = await supabase
                  .from('profiles')
                  .upsert({
                    id: signUpData.user.id,
                    email: email,
                    full_name: 'Azeez Wosilat',
                    role: 'member'
                  });
                
                if (profileError) {
                  console.error("Error creating profile:", profileError);
                } else {
                  console.log("Profile created successfully");
                  
                  // Now try to create super admin role
                  try {
                    await supabase.rpc('create_super_admin');
                    toast.success("Super admin created successfully");
                  } catch (rpcError) {
                    console.error("Super admin RPC error after signup:", rpcError);
                  }
                }
              } catch (profileCreationError) {
                console.error("Profile creation error:", profileCreationError);
              }
            }
            
            onSuperAdminSignup?.();
          }
        } catch (err) {
          console.error("Super admin creation error:", err);
          setError("Failed to create super admin account: " + (err.message || "Unknown error"));
        } finally {
          setIsSuperAdminProcessing(false);
        }
        
        return;
      }

      // Regular user login
      await login(email, password);
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
      console.error(err);
      setIsSuperAdminProcessing(false);
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
              disabled={isLoading || isSuperAdminProcessing}
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
                  disabled={isLoading || isSuperAdminProcessing}
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
              disabled={isLoading || isSuperAdminProcessing}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || isSuperAdminProcessing}>
            {isLoading || isSuperAdminProcessing ? "Signing in..." : "Sign In"}
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
            disabled={isLoading || isSuperAdminProcessing}
          >
            Register your community
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
