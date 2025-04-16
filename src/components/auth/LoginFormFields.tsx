
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface LoginFormFieldsProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  error: string;
  isLoading: boolean;
  onForgotPasswordClick?: () => void;
  disabled?: boolean;
}

export default function LoginFormFields({
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  error,
  isLoading,
  onForgotPasswordClick,
  disabled = false
}: LoginFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
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
          disabled={isLoading || disabled}
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
              disabled={isLoading || disabled}
            >
              Forgot password?
            </Button>
          )}
        </div>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading || disabled}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="showPassword" 
          checked={showPassword} 
          onCheckedChange={(checked) => setShowPassword(checked === true)}
          disabled={isLoading || disabled}
        />
        <Label htmlFor="showPassword" className="text-sm cursor-pointer">Show password</Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || disabled}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
