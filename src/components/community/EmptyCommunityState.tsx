
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus, Users } from "lucide-react";

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
        <Dialog open={createDialogOpen} onOpenChange={onCreateDialogOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Community
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Community</DialogTitle>
              <DialogDescription>
                Create a new community that you'll manage. You'll be assigned as the leader.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name">Community Name</label>
                <Input
                  id="name"
                  value={newCommunityName}
                  onChange={(e) => onNewCommunityNameChange(e.target.value)}
                  placeholder="Enter community name..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={onCreateCommunity} 
                disabled={loading || !newCommunityName.trim()}
              >
                {loading ? "Creating..." : "Create Community"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
