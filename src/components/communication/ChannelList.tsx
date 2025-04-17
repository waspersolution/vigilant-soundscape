
import { useState } from "react";
import { Plus, Hash, Megaphone, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Channel } from "@/types";
import { createChannel } from "@/services/communicationService";
import { useAuth } from "@/contexts/AuthContext";

interface ChannelListProps {
  channels: Channel[];
  selectedChannelId?: string;
  onSelectChannel: (channel: Channel) => void;
}

export default function ChannelList({ channels, selectedChannelId, onSelectChannel }: ChannelListProps) {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [newChannel, setNewChannel] = useState({
    name: "",
    type: "general_chat" as Channel["type"],
    description: "",
  });

  const isLeaderOrAdmin = user?.role === "community_leader" || user?.role === "admin" || user?.role === "community_manager";

  const handleCreateChannel = async () => {
    if (!user?.communityId || !newChannel.name) return;
    
    const channel = await createChannel({
      name: newChannel.name,
      type: newChannel.type,
      communityId: user.communityId,
      description: newChannel.description,
    });
    
    if (channel) {
      setNewChannel({ name: "", type: "general_chat", description: "" });
      setIsCreating(false);
      onSelectChannel(channel);
    }
  };

  const getChannelIcon = (type: Channel["type"]) => {
    switch (type) {
      case "security_patrol":
        return <Shield size={16} />;
      case "announcements":
        return <Megaphone size={16} />;
      default:
        return <Hash size={16} />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Channels</h3>
        {isLeaderOrAdmin && (
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Plus size={16} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new channel</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="channel-name">Channel name</Label>
                  <Input
                    id="channel-name"
                    placeholder="e.g. neighborhood-watch"
                    value={newChannel.name}
                    onChange={(e) => setNewChannel({ ...newChannel, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="channel-type">Channel type</Label>
                  <Select
                    value={newChannel.type}
                    onValueChange={(value: any) => setNewChannel({ ...newChannel, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select channel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general_chat">General Chat</SelectItem>
                      <SelectItem value="security_patrol">Security Patrol</SelectItem>
                      <SelectItem value="alerts_only">Alerts Only</SelectItem>
                      <SelectItem value="announcements">Announcements</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="channel-description">Description (optional)</Label>
                  <Input
                    id="channel-description"
                    placeholder="What's this channel about?"
                    value={newChannel.description}
                    onChange={(e) => setNewChannel({ ...newChannel, description: e.target.value })}
                  />
                </div>
                <Button onClick={handleCreateChannel} className="w-full">Create Channel</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <Separator />
      <div className="space-y-1">
        {channels.length === 0 ? (
          <p className="text-sm text-muted-foreground">No channels available</p>
        ) : (
          channels.map((channel) => (
            <Button
              key={channel.id}
              variant={channel.id === selectedChannelId ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onSelectChannel(channel)}
            >
              <span className="mr-2">{getChannelIcon(channel.type)}</span>
              {channel.name}
            </Button>
          ))
        )}
      </div>
    </div>
  );
}
