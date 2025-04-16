
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
        
        // User exists, try to run the create_super_admin RPC
        try {
          const { data: rpcData, error: rpcError } = await supabase.rpc('create_super_admin');
          
          if (rpcError) {
            console.error("Super admin RPC error:", rpcError);
            toast.error(`RPC error: ${rpcError.message}`);
            // Continue anyway as user might already be a super admin
          } else {
            toast.success("Super admin role applied successfully");
            console.log("Super admin role applied successfully");
          }
        } catch (rpcError: any) {
          console.error("Super admin RPC exception:", rpcError);
          // User might already be a super admin, continue anyway
        }
        
        if (onSuperAdminSignup) {
          onSuperAdminSignup();
        }
        return;
      }
      
      // If user doesn't exist, create it
      if (signInError) {
        console.log("User doesn't exist, creating super admin...", signInError);
        
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
          console.error("Signup error details:", signUpError);
          throw new Error(`Signup error: ${signUpError.message}`);
        }
        
        if (signUpData.user) {
          await this.handleProfileCreation(signUpData.user.id, email);
          
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

  private static async handleProfileCreation(userId: string, email: string) {
    console.log("User created, checking for profile:", userId);
    
    // Check if profile was created by the trigger
    const { data: profileCheck, error: profileCheckError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profileCheckError) {
      console.error("Error checking for profile:", profileCheckError);
    }
      
    if (!profileCheck) {
      console.log("Profile not found, manually creating...");
      
      // Manually create profile if trigger fails
      try {
        // First, check if the enum type exists
        const { data: enumCheck, error: enumError } = await supabase
          .from('pg_type')
          .select('*')
          .eq('typname', 'user_role')
          .maybeSingle();
          
        console.log("Enum check result:", enumCheck, enumError);
        
        // Manually create profile if trigger fails
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            email: email,
            full_name: 'Azeez Wosilat',
            role: 'member'
          });
        
        if (profileError) {
          console.error("Error creating profile:", profileError);
          toast.error("Profile creation error: " + profileError.message);
          throw new Error(`Profile creation error: ${profileError.message}`);
        } else {
          console.log("Profile created successfully:", profileData);
          
          // Now try to create super admin role
          try {
            const { data: rpcData, error: rpcError } = await supabase.rpc('create_super_admin');
            
            if (rpcError) {
              console.error("Super admin RPC error after signup:", rpcError);
              toast.error("Error creating super admin role: " + rpcError.message);
              throw new Error(`RPC error: ${rpcError.message}`);
            } else {
              toast.success("Super admin created successfully");
              console.log("Super admin created successfully:", rpcData);
            }
          } catch (rpcError: any) {
            console.error("Super admin RPC exception after signup:", rpcError);
            toast.error("Error creating super admin role: " + (rpcError.message || "Unknown error"));
            throw new Error(`RPC exception: ${rpcError.message || "Unknown error"}`);
          }
        }
      } catch (profileCreationError: any) {
        console.error("Profile creation error:", profileCreationError);
        toast.error("Profile creation error: " + (profileCreationError.message || "Unknown error"));
        throw profileCreationError;
      }
    } else {
      console.log("Profile already exists, updating to super admin");
      try {
        const { data: rpcData, error: rpcError } = await supabase.rpc('create_super_admin');
        
        if (rpcError) {
          console.error("Super admin RPC error with existing profile:", rpcError);
          toast.error("Error creating super admin role: " + rpcError.message);
          throw new Error(`RPC error: ${rpcError.message}`);
        } else {
          toast.success("Super admin created successfully");
          console.log("Super admin created successfully:", rpcData);
        }
      } catch (rpcError: any) {
        console.error("Super admin RPC exception with existing profile:", rpcError);
        toast.error("Error creating super admin role: " + (rpcError.message || "Unknown error"));
        throw new Error(`RPC exception: ${rpcError.message || "Unknown error"}`);
      }
    }
  }
}

export default SuperAdminHandler;
