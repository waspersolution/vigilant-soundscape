
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];

class SuperAdminHandler {
  static async handleSuperAdmin(
    email: string,
    password: string,
    onSuperAdminSignup?: () => void,
    onFinish?: () => void,
    onError?: (errorMsg: string) => void
  ) {
    try {
      console.log("Starting super admin login process...");
      
      // First try to sign in, in case the user already exists
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (signInData.user) {
        console.log("Super admin user found, logging in:", signInData.user.id);
        
        // Force update user metadata with super_admin role
        try {
          console.log("Updating user metadata with super_admin role");
          const { error: metadataError } = await supabase.auth.updateUser({
            data: { 
              role: 'super_admin',
              full_name: 'Azeez Wosilat'
            }
          });
          
          if (metadataError) {
            console.error("Metadata update error:", metadataError);
            // Continue anyway as we at least authenticated successfully
          } else {
            console.log("User metadata updated successfully with role: super_admin");
            
            // Refresh the session with updated metadata
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            console.log("Session refreshed:", refreshData?.session ? "success" : "failed");
            console.log("Updated user metadata:", refreshData?.user?.user_metadata);
            
            if (refreshError) {
              console.error("Session refresh error:", refreshError);
            }
          }
        } catch (updateError: any) {
          console.error("Metadata update exception:", updateError);
        }
        
        if (onSuperAdminSignup) {
          onSuperAdminSignup();
        }
        
        // Force redirect to super admin dashboard to ensure proper loading
        window.location.href = "/super-admin";
        return;
      }
      
      // If user doesn't exist, create it
      if (signInError) {
        console.log("User doesn't exist, creating super admin...", signInError);
        
        // Check for rate limiting errors before attempting to sign up
        if (signInError.message.includes("rate limit") || 
            signInError.message.includes("For security purposes") ||
            signInError.status === 429) {
          const errorMsg = "Rate limit exceeded. Please wait a few minutes before trying again.";
          console.error("Rate limit error:", errorMsg);
          toast.error(errorMsg);
          if (onError) onError(errorMsg);
          if (onFinish) onFinish();
          return;
        }
        
        // Create the user with super_admin role in metadata
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: 'Azeez Wosilat',
              role: 'super_admin'
            }
          }
        });
        
        if (signUpError) {
          // Handle rate limiting on signup
          if (signUpError.message.includes("rate limit") || 
              signUpError.message.includes("For security purposes") ||
              signUpError.status === 429) {
            const errorMsg = "Rate limit exceeded. Please wait a few minutes before trying again.";
            console.error("Rate limit error:", signUpError);
            toast.error(errorMsg);
            if (onError) onError(errorMsg);
            return;
          }
          
          console.error("Signup error details:", signUpError);
          throw new Error(`Signup error: ${signUpError.message}`);
        }
        
        if (signUpData.user) {
          console.log("Super admin created successfully:", signUpData.user.id);
          console.log("User metadata:", signUpData.user.user_metadata);
          toast.success("Super admin created successfully - check your email for confirmation");
          
          if (onSuperAdminSignup) {
            onSuperAdminSignup();
          }
          
          // Force redirect to admin dashboard
          window.location.href = "/super-admin";
        } else {
          throw new Error("User creation successful but user data is missing");
        }
      }
    } catch (err: any) {
      console.error("Super admin creation error:", err);
      if (onError) {
        onError("Failed to create super admin account: " + (err.message || "Unknown error"));
      }
      toast.error("Super admin creation failed: " + (err.message || "Unknown error"));
    } finally {
      if (onFinish) {
        onFinish();
      }
    }
  }
}

export default SuperAdminHandler;
