
import { User } from "@/types";
import { Database } from "@/integrations/supabase/types";

export type UserWithCommunity = User & {
  communityName?: string;
};

export interface UserFormValues {
  fullName: string;
  email: string;
  role: Database["public"]["Enums"]["user_role"];
  communityId: string;
}
