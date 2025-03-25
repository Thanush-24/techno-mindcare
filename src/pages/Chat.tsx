
import React, { useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import MoodTracker from '../components/MoodTracker';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useChat } from '../context/ChatContext';
import { MessageCircle, Heart } from 'lucide-react';

const Chat = () => {
  const { resetChat } = useChat();
  const [showMoodTracker, setShowMoodTracker] = useState<boolean>(false);
  
  const handleResetChat = () => {
    resetChat();
  };
  
  return (
    <div className="w-full max-w-4xl h-[calc(100vh-12rem)] relative overflow-hidden">
      <Card className="glass-card w-full h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border/50 p-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} className="text-primary" />
            <h2 className="font-medium">Chat with Techno</h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMoodTracker(true)}
              className="text-sm gap-1"
            >
              <Heart size={16} className="text-techno-blush" />
              <span className="hidden sm:inline">Log Mood</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetChat}
              className="text-sm"
            >
              New Chat
            </Button>
          </div>
        </div>

        {/* Chat interface */}
        <CardContent className="p-0 flex-1 overflow-hidden relative">
          <ChatInterface className="h-full" />
          
          {/* Mood tracker overlay */}
          {showMoodTracker && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center p-4">
              <MoodTracker 
                onComplete={() => setShowMoodTracker(false)} 
                className="transform transition-all animate-fade-in"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
