
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import DynamicDialog from "@/components/ui/dynamic-dialog";

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onEmailChange: (email: string) => void;
  onInvite: () => Promise<void>;
  loading: boolean;
}

export default function InviteMemberDialog({
  open,
  onOpenChange,
  email,
  onEmailChange,
  onInvite,
  loading
}: InviteMemberDialogProps) {
  return (
    <DynamicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Invite New Member"
      description="Send an invitation to join your community"
      trigger={
        <Button size="sm" variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite
        </Button>
      }
      inputLabel="Email Address"
      inputValue={email}
      inputId="email"
      inputType="email"
      inputPlaceholder="Enter email address..."
      onInputChange={onEmailChange}
      onSubmit={onInvite}
      submitButtonText="Send Invitation"
      loadingText="Sending..."
      loading={loading}
      disabled={!email.trim()}
    />
  );
}
