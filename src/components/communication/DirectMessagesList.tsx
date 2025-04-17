
import { useState } from "react";
import { UserPlus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Channel, User as UserType } from "@/types";
import { createChannel } from "@/services/communicationService";
import { fetchCommunityMembers } from "@/services/communityService";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

interface DirectMessagesListProps {
  directMessages: Channel[];
  selectedChannelId?: string;
  onSelectChannel: (channel: Channel) => void;
}

export default function DirectMessagesList({ 
  directMessages, 
  selectedChannelId, 
  onSelectChannel 
}: DirectMessagesListProps) {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch community members for new direct messages
  const { data: communityMembers = [] } = useQuery({
    queryKey: ["communityMembers", user?.communityId],
    queryFn: () => fetchCommunityMembers(user?.communityId || ""),
    enabled: !!user?.communityId,
  });

  // Filter out the current user and already messaged users
  const filteredMembers = communityMembers
    .filter(member => member.id !== user?.id)
    .filter(member => 
      search ? member.fullName.toLowerCase().includes(search.toLowerCase()) : true
    );

  const startDirectMessage = async (recipient: UserType) => {
    if (!user?.id || !user?.communityId) return;
    
    // Check if a direct channel already exists with this user
    const existingChannel = directMessages.find(channel => 
      channel.participants?.includes(recipient.id) && 
      channel.participants?.includes(user.id)
    );
    
    if (existingChannel) {
      onSelectChannel(existingChannel);
      setIsCreating(false);
      return;
    }
    
    // Create a new direct message channel
    const channel = await createChannel({
      name: `${user.fullName} & ${recipient.fullName}`,
      type: "direct",
      communityId: user.communityId,
      participants: [user.id, recipient.id],
    });
    
    if (channel) {
      setIsCreating(false);
      onSelectChannel(channel);
    }
  };

  const getNameInitials = (name: string) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getOtherParticipant = (channel: Channel) => {
    if (!user?.id || !channel.participants) return "Unknown";
    
    // Find the other participant's ID
    const otherParticipantId = channel.participants.find(id => id !== user.id);
    
    // Find the user in community members
    const otherUser = communityMembers.find(member => member.id === otherParticipantId);
    
    return otherUser?.fullName || "Unknown User";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Direct Messages</h3>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <UserPlus size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Direct Message</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <Input
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {filteredMembers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No community members found</p>
                ) : (
                  filteredMembers.map((member) => (
                    <Button
                      key={member.id}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => startDirectMessage(member)}
                    >
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarFallback>{getNameInitials(member.fullName)}</AvatarFallback>
                      </Avatar>
                      {member.fullName}
                    </Button>
                  ))
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Separator />
      <div className="space-y-1">
        {directMessages.length === 0 ? (
          <p className="text-sm text-muted-foreground">No conversations yet</p>
        ) : (
          directMessages.map((channel) => (
            <Button
              key={channel.id}
              variant={channel.id === selectedChannelId ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onSelectChannel(channel)}
            >
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback>{getNameInitials(getOtherParticipant(channel))}</AvatarFallback>
              </Avatar>
              {getOtherParticipant(channel)}
            </Button>
          ))
        )}
      </div>
    </div>
  );
}
