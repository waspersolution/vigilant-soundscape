
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

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
        
        // User exists, try to update the profile with super_admin role using a string directly
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: signInData.user.id,
              email: email,
              full_name: 'Azeez Wosilat',
              role: 'super_admin', // Using a string instead of enum
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
      
      // If user doesn't exist, create it
      if (signInError) {
        console.log("User doesn't exist, creating super admin...", signInError);
        
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
          console.error("Signup error details:", signUpError);
          throw new Error(`Signup error: ${signUpError.message}`);
        }
        
        if (signUpData.user) {
          // Create profile for the new user with super_admin role as string
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: signUpData.user.id,
                email: email,
                full_name: 'Azeez Wosilat',
                role: 'super_admin', // Using a string instead of enum
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
