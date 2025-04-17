
import { User } from "@/types";

export type UserWithCommunity = User & {
  communityName?: string;
};

export interface UserFormValues {
  fullName: string;
  email: string;
  role: string;
  communityId: string;
}
