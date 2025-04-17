
import { useForm, FormProvider } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DynamicDialog from "@/components/ui/dynamic-dialog";
import { UserWithCommunity, UserFormValues } from "./types";
import { Database } from "@/integrations/supabase/types";
import { useEffect } from "react";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingUser: UserWithCommunity | null;
  communities: { id: string; name: string }[];
  isSubmitting: boolean;
  onSubmit: (data: UserFormValues) => Promise<void>;
}

export default function UserFormDialog({
  open,
  onOpenChange,
  editingUser,
  communities,
  isSubmitting,
  onSubmit
}: UserFormDialogProps) {
  const userForm = useForm<UserFormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      role: 'member' as Database["public"]["Enums"]["user_role"],
      communityId: '',
    }
  });

  useEffect(() => {
    if (editingUser) {
      userForm.reset({
        fullName: editingUser.fullName,
        email: editingUser.email,
        role: editingUser.role,
        communityId: editingUser.communityId || '',
      });
    } else {
      userForm.reset({
        fullName: '',
        email: '',
        role: 'member',
        communityId: '',
      });
    }
  }, [editingUser, userForm]);

  return (
    <FormProvider {...userForm}>
      <DynamicDialog
        open={open}
        onOpenChange={onOpenChange}
        title={editingUser ? 'Edit User' : 'Create New User'}
        description={editingUser 
          ? 'Update this user\'s information' 
          : 'Add a new user to the platform'
        }
        submitButtonText={editingUser ? 'Save Changes' : 'Create User'}
        loadingText="Saving..."
        loading={isSubmitting}
        onSubmit={userForm.handleSubmit(onSubmit)}
      >
        <Form {...userForm}>
          <div className="grid gap-4 py-4">
            <FormField
              control={userForm.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={userForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={userForm.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="security_personnel">Security Personnel</SelectItem>
                      <SelectItem value="community_manager">Community Manager</SelectItem>
                      <SelectItem value="community_leader">Community Leader</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={userForm.control}
              name="communityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Community</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a community" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">No Community</SelectItem>
                      {communities.map(community => (
                        <SelectItem key={community.id} value={community.id}>
                          {community.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </DynamicDialog>
    </FormProvider>
  );
}
