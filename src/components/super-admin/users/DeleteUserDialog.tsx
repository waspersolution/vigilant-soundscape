
import DynamicDialog from "@/components/ui/dynamic-dialog";
import { UserWithCommunity } from "./types";

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userToDelete: UserWithCommunity | null;
  isDeleting: boolean;
  onConfirmDelete: () => Promise<void>;
}

export default function DeleteUserDialog({
  open,
  onOpenChange,
  userToDelete,
  isDeleting,
  onConfirmDelete
}: DeleteUserDialogProps) {
  return (
    <DynamicDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete User"
      description={`Are you sure you want to delete ${userToDelete?.fullName}? This action cannot be undone.`}
      submitButtonText="Delete User"
      loadingText="Deleting..."
      loading={isDeleting}
      onSubmit={onConfirmDelete}
    />
  );
}
