
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Mic, MicOff, Radio, Volume2, VolumeX } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useVoiceChannel } from "@/hooks/useVoiceChannel";
import { Channel } from "@/types";

interface VoiceChannelProps {
  channel: Channel;
}

const VoiceChannel: React.FC<VoiceChannelProps> = ({ channel }) => {
  const { user } = useAuth();
  const { 
    isTransmitting, 
    isReceiving, 
    isMuted,
    activeTransmitters,
    recentMessages,
    toggleMute,
    startTransmission,
    stopTransmission
  } = useVoiceChannel(channel.id);

  if (!user || !user.communityId) {
    return (
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Not Available</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You must be part of a community to use voice channels.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Radio className={`h-5 w-5 ${isReceiving ? 'text-green-500 animate-pulse' : 'text-muted-foreground'}`} />
          <CardTitle className="text-lg">{channel.name}</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className={isMuted ? 'text-destructive' : ''}
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
      </CardHeader>
      
      <CardContent className="pb-2">
        <ScrollArea className="h-[250px]">
          {recentMessages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <p>No recent transmissions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((message) => (
                <div key={message.id} className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {message.senderName?.substring(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{message.senderName || 'Unknown'}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    {message.audioUrl && (
                      <audio 
                        controls 
                        src={message.audioUrl} 
                        className="h-8 w-full max-w-[250px]"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>

      <CardFooter className="pt-2">
        <Button 
          className="relative w-full h-12 gap-2 overflow-hidden"
          variant={isTransmitting ? "destructive" : "default"}
          onMouseDown={startTransmission}
          onMouseUp={stopTransmission}
          onMouseLeave={stopTransmission}
          onTouchStart={startTransmission}
          onTouchEnd={stopTransmission}
          disabled={!user || !user.communityId}
        >
          {isTransmitting ? (
            <>
              <Mic className="h-5 w-5 animate-pulse" />
              <span>Transmitting...</span>
              <div className="absolute bottom-0 left-0 h-1 bg-background/40" style={{ 
                width: `100%`, 
                animation: 'pulse 2s infinite' 
              }}></div>
            </>
          ) : (
            <>
              <MicOff className="h-5 w-5" />
              <span>Press & Hold to Talk</span>
            </>
          )}
        </Button>
      </CardFooter>
      
      {activeTransmitters.length > 0 && (
        <div className="px-4 py-2 bg-primary/10 rounded-b-lg animate-pulse">
          {activeTransmitters.map((transmitter) => (
            <div key={transmitter.id} className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-primary" />
              <span className="text-sm">{transmitter.fullName || 'Someone'} is transmitting...</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default VoiceChannel;
