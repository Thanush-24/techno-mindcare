
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChat } from '../context/ChatContext';
import { getEmotionEmoji } from '../utils/emotions';

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className = '' }) => {
  const { messages, isTyping, sendMessage } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Focus the input field when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                ${message.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}
                ${message.sender === 'user' && message.emotion ? `relative` : ''}
              `}
            >
              {message.text}
              
              {/* Emotion indicator for user messages */}
              {message.sender === 'user' && message.emotion && message.emotion !== 'neutral' && (
                <div className="absolute -top-3 -right-3 w-6 h-6 flex items-center justify-center rounded-full bg-white shadow-md">
                  {getEmotionEmoji(message.emotion)}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="chat-bubble-bot bg-secondary/50">
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}

        {/* Invisible element for scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="relative">
          <Textarea
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="pr-12 resize-none min-h-[60px] max-h-32 bg-background/50"
            rows={1}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute right-2 bottom-2 h-8 w-8"
            disabled={!newMessage.trim() || isTyping}
          >
            <Send size={16} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
