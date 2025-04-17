
import { Database } from "@/integrations/supabase/types";

// User type for profiles and community management
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Database["public"]["Enums"]["user_role"];
  communityId?: string;
  onlineStatus?: boolean;
  lastLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
}
