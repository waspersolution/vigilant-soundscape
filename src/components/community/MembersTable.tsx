
import { User } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, User as UserIcon, MoreHorizontal } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];

interface MembersTableProps {
  members: User[];
  currentUserId: string;
  isLeader: boolean;
  onUpdateRole: (userId: string, newRole: UserRole) => void;
  onRemoveMember: (userId: string) => void;
}

export default function MembersTable({
  members,
  currentUserId,
  isLeader,
  onUpdateRole,
  onRemoveMember
}: MembersTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            {isLeader && <TableHead className="w-16"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{member.fullName}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  {member.role === 'community_leader' ? (
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3 text-primary" />
                      <span>Leader</span>
                    </div>
                  ) : member.role === 'security_personnel' ? (
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3 text-blue-500" />
                      <span>Security</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <UserIcon className="h-3 w-3 text-gray-500" />
                      <span>Member</span>
                    </div>
                  )}
                </div>
              </TableCell>
              {isLeader && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onUpdateRole(member.id, 'security_personnel')}
                        disabled={member.role === 'community_leader'} // Don't allow changing the leader's role
                      >
                        Make Security Guard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onUpdateRole(member.id, 'member')}
                        disabled={member.role === 'community_leader'} // Don't allow changing the leader's role
                      >
                        Make Regular Member
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => onRemoveMember(member.id)}
                        disabled={member.id === currentUserId} // Don't allow removing self
                      >
                        Remove from Community
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
