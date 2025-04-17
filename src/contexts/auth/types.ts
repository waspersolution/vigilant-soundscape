
import { User, Session } from '@supabase/supabase-js';
import { Database } from "@/integrations/supabase/types";

export type ProfileType = Database["public"]["Tables"]["profiles"]["Row"];
export type UserRole = Database["public"]["Enums"]["user_role"];

export interface UserWithRole extends User {
  role?: UserRole;
  fullName?: string;
  communityId?: string | null;
  onlineStatus?: boolean;
  lastLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
  };
}

export interface AuthContextType {
  user: UserWithRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
}
