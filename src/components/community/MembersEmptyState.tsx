
import { Users } from "lucide-react";

export default function MembersEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-center space-y-3">
      <Users className="h-12 w-12 text-muted-foreground/50" />
      <div>
        <p>No members found</p>
        <p className="text-sm text-muted-foreground">Invite members to join your community</p>
      </div>
    </div>
  );
}
