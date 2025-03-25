
import React, { createContext, useContext, useState, useEffect } from 'react';
import { detectEmotion } from '../utils/emotions';
import { getSelfCareSuggestion } from '../utils/selfCare';
import { generateResponse } from '../utils/aiResponseGenerator';
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
  const [previousEmotion, setPreviousEmotion] = useState<string>('neutral');

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

  const getBotResponse = async (userMessage: string, userEmotion: string): Promise<string> => {
    // Simulate API call to an AI service
    setIsTyping(true);
    
    // In a real app, this would be an API call to a language model
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
    
    // Use our improved AI response generator
    const response = generateResponse(
      userMessage, 
      userEmotion, 
      messages.length, 
      previousEmotion
    );
    
    setIsTyping(false);
    return response;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const userEmotion = detectEmotion(text);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date(),
      emotion: userEmotion
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setPreviousEmotion(userEmotion); // Store the current emotion for context in future responses
    
    try {
      const botResponse = await getBotResponse(text, userEmotion);
      
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
    
    setPreviousEmotion('neutral');
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
