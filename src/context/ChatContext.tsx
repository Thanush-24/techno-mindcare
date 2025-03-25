
import React, { createContext, useContext, useState, useEffect } from 'react';
import { detectEmotion } from '../utils/emotions';
import { getSelfCareSuggestion } from '../utils/selfCare';
import { useAuth } from './AuthContext';
import { toast } from "sonner";

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  emotion?: string;
}

interface ChatHistory {
  date: string;
  messages: Message[];
}

interface ChatContextType {
  messages: Message[];
  isTyping: boolean;
  sendMessage: (text: string) => Promise<void>;
  resetChat: () => void;
  chatHistory: ChatHistory[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);

  // Initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      const greeting: Message = {
        id: Date.now().toString(),
        sender: 'bot',
        text: "Hi there! I'm Techno, your AI mental health companion. How are you feeling today?",
        timestamp: new Date()
      };
      setMessages([greeting]);
    }
  }, [messages.length]);

  // Load chat history from localStorage
  useEffect(() => {
    if (user) {
      const storedHistory = localStorage.getItem(`techno_chat_history_${user.id}`);
      if (storedHistory) {
        setChatHistory(JSON.parse(storedHistory));
      }
    }
  }, [user]);

  // Save messages to chat history when session ends or component unmounts
  useEffect(() => {
    return () => {
      if (user && messages.length > 1) {
        saveChatToHistory();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, user]);

  const saveChatToHistory = () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    const newHistory = [...chatHistory];
    
    const todayIndex = newHistory.findIndex(h => h.date === today);
    
    if (todayIndex >= 0) {
      newHistory[todayIndex].messages = messages;
    } else {
      newHistory.push({ date: today, messages });
    }
    
    setChatHistory(newHistory);
    localStorage.setItem(`techno_chat_history_${user.id}`, JSON.stringify(newHistory));
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    const emotion = detectEmotion(userMessage);
    
    // Simulate API call to an AI service (like GPT)
    setIsTyping(true);
    
    // In a real app, this would be an API call to a language model
    // For demo purposes, we'll use predefined responses based on detected emotion
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    
    let response = '';
    
    switch(emotion) {
      case 'happy':
        response = "That's wonderful to hear! I'm glad you're feeling good today. What's been going well for you?";
        break;
      case 'sad':
        response = "I'm sorry to hear you're feeling down. Remember that it's okay to not be okay sometimes. Would you like to talk about what's troubling you?";
        break;
      case 'angry':
        response = "I notice you might be feeling frustrated. Taking deep breaths can help in moments like these. Would you like me to guide you through a quick breathing exercise?";
        break;
      case 'anxious':
        response = "It sounds like you might be experiencing some anxiety. Let's take a moment to focus on the present. Can you tell me 3 things you can see around you right now?";
        break;
      default:
        response = "Thank you for sharing that with me. How else have you been feeling lately?";
    }
    
    // If message includes certain keywords, suggest self-care
    if (userMessage.match(/overwhelmed|stressed|tired|exhausted|can't cope/i)) {
      const suggestion = getSelfCareSuggestion(emotion || 'neutral');
      response += ` ${suggestion}`;
    }
    
    setIsTyping(false);
    return response;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date(),
      emotion: detectEmotion(text)
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    try {
      const botResponse = await getBotResponse(text);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      toast.error("I'm having trouble responding right now. Please try again later.");
      console.error("Error getting bot response:", error);
    }
  };

  const resetChat = () => {
    if (messages.length > 1) {
      saveChatToHistory();
    }
    
    setMessages([{
      id: Date.now().toString(),
      sender: 'bot',
      text: "Hi there! I'm Techno, your AI mental health companion. How are you feeling today?",
      timestamp: new Date()
    }]);
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      isTyping, 
      sendMessage, 
      resetChat,
      chatHistory
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
