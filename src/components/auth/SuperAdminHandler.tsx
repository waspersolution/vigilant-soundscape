
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
        
        // Update user metadata with super_admin role
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
            console.log("User metadata updated successfully");
            toast.success("Super admin login successful");
            
            // Refresh the session to get updated metadata
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
            if (!refreshError) {
              console.log("Session refreshed with updated metadata");
            }
          }
        } catch (updateError: any) {
          console.error("Metadata update exception:", updateError);
          // Continue anyway as we at least authenticated successfully
        }
        
        if (onSuperAdminSignup) {
          onSuperAdminSignup();
        }
        return;
      }
      
      // Handle the case where user doesn't exist due to email not being confirmed
      if (signInError?.message === "Email not confirmed") {
        console.log("Email not confirmed, checking if user exists");
        
        // Instead of using getUserByEmail which doesn't exist, we'll use a workaround
        // to check if the user exists by trying to sign in with a wrong password
        // and checking the error message
        const { error: checkUserError } = await supabase.auth.signInWithPassword({
          email,
          password: password + "_wrong_password_to_check_existence"
        });
        
        if (checkUserError && checkUserError.message === "Invalid login credentials") {
          console.log("User exists but email not confirmed or password incorrect");
          toast.info("Your account exists but email is not confirmed or password is incorrect. Please check your email for confirmation link or try again later.");
          if (onFinish) onFinish();
          return;
        }
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
          toast.success("Super admin created successfully - check your email for confirmation");
          
          if (onSuperAdminSignup) {
            onSuperAdminSignup();
          }
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
