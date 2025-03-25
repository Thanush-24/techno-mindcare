
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

interface EmotionalState {
  emotion: string;
  count: number;
  alerted?: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [previousEmotion, setPreviousEmotion] = useState<string>('neutral');
  const [consecutiveEmotions, setConsecutiveEmotions] = useState<EmotionalState>({
    emotion: 'neutral', 
    count: 0,
    alerted: false
  });

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

  const calculateResponseDelay = (text: string): number => {
    // Make response time more human-like based on message length
    const baseDelay = 1000; // 1 second minimum
    const charsPerSecond = 15; // Reading/typing speed approximation
    
    // Calculate delay based on text length, but cap it
    const lengthBasedDelay = Math.min(
      text.length / charsPerSecond * 1000,
      3000 // Cap at 3 seconds
    );
    
    return baseDelay + lengthBasedDelay;
  };

  const getBotResponse = async (userMessage: string, userEmotion: string): Promise<string> => {
    // Simulate API call to an AI service
    setIsTyping(true);
    
    // In a real app, this would be an API call to a language model
    const responseDelay = calculateResponseDelay(userMessage);
    await new Promise(resolve => setTimeout(resolve, responseDelay)); 
    
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

  const trackEmotionalState = (emotion: string) => {
    // Track consecutive same emotions to detect patterns
    if (emotion === consecutiveEmotions.emotion) {
      setConsecutiveEmotions({
        emotion,
        count: consecutiveEmotions.count + 1,
        alerted: consecutiveEmotions.alerted
      });
    } else {
      setConsecutiveEmotions({
        emotion,
        count: 1,
        alerted: false
      });
    }
    
    // Alert for concerning emotional patterns (in a real app, this might trigger different responses)
    if (consecutiveEmotions.count >= 5 && 
        (emotion === 'sad' || emotion === 'anxious') && 
        !consecutiveEmotions.alerted) {
      console.log("Detected consistent negative emotional state");
      // This could trigger special recommendations or resources in a production app
      setConsecutiveEmotions(prev => ({ ...prev, alerted: true }));
    }
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
    trackEmotionalState(userEmotion);
    
    try {
      const botResponse = await getBotResponse(text, userEmotion);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      
      // Auto-save chat to history after a meaningful exchange
      if (messages.length % 10 === 0) {
        saveChatToHistory();
      }
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
    setConsecutiveEmotions({emotion: 'neutral', count: 0, alerted: false});
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
