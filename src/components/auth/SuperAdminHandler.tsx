
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
        
        // User exists, try to update the profile with super_admin role using the enum type
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: signInData.user.id,
              email: email,
              full_name: 'Azeez Wosilat',
              role: 'super_admin' as UserRole, // Using the enum type
              community_id: null
            })
            .select();
          
          if (profileError) {
            console.error("Profile update error:", profileError);
            toast.error(`Profile error: ${profileError.message}`);
            // Continue anyway, as this might be a non-critical error
          } else {
            console.log("Profile updated successfully:", profileData);
            toast.success("Super admin profile updated successfully");
          }
        } catch (profileError: any) {
          console.error("Profile update exception:", profileError);
          // Continue anyway, as this might be a non-critical error
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
        
        // Manual approach to create user
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
          // Create profile for the new user with super_admin role
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: signUpData.user.id,
                email: email,
                full_name: 'Azeez Wosilat',
                role: 'super_admin' as UserRole, // Using the enum type
                community_id: null
              })
              .select();
            
            if (profileError) {
              console.error("Profile creation error:", profileError);
              toast.error(`Profile error: ${profileError.message}`);
              // Continue anyway, as the auth user was created
            } else {
              console.log("Profile created successfully:", profileData);
            }
          } catch (profileError: any) {
            console.error("Profile creation exception:", profileError);
            // Continue anyway, as the auth user was created
          }
          
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
