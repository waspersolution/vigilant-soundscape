
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Plus, Users } from "lucide-react";
import DynamicDialog from "@/components/ui/dynamic-dialog";

interface EmptyCommunityStateProps {
  createDialogOpen: boolean;
  onCreateDialogOpenChange: (open: boolean) => void;
  newCommunityName: string;
  onNewCommunityNameChange: (name: string) => void;
  onCreateCommunity: () => void;
  loading: boolean;
}

export default function EmptyCommunityState({
  createDialogOpen,
  onCreateDialogOpenChange,
  newCommunityName,
  onNewCommunityNameChange,
  onCreateCommunity,
  loading
}: EmptyCommunityStateProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
        <Users className="h-16 w-16 text-muted-foreground/40" />
        <div>
          <h3 className="text-lg font-medium">No Community Selected</h3>
          <p className="text-sm text-muted-foreground">
            Select a community from the list or create a new one to get started
          </p>
        </div>
        <DynamicDialog
          open={createDialogOpen}
          onOpenChange={onCreateDialogOpenChange}
          title="Create New Community"
          description="Create a new community that you'll manage. You'll be assigned as the leader."
          trigger={
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Community
            </Button>
          }
          inputLabel="Community Name"
          inputValue={newCommunityName}
          inputId="name"
          inputPlaceholder="Enter community name..."
          onInputChange={onNewCommunityNameChange}
          onSubmit={onCreateCommunity}
          submitButtonText="Create Community"
          loadingText="Creating..."
          loading={loading}
          disabled={!newCommunityName.trim()}
        />
      </CardContent>
    </Card>
  );
}
