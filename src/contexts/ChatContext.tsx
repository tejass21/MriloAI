import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  text: string;
  isAi: boolean;
  timestamp: string;
  codeBlocks?: Array<{
    language: string;
    code: string;
  }>;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: string;
}

interface ChatContextType {
  messages: Message[];
  chatSessions: ChatSession[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  handleSendMessage: (message: string) => Promise<void>;
  createNewChat: () => void;
  deleteChat: (chatId: string) => void;
  renameChat: (chatId: string, newTitle: string) => void;
  toggleFavorite: (chatId: string) => void;
  moveToFolder: (chatId: string, folderName: string) => void;
  createFolder: (folderName: string) => void;
  favorites: string[];
  folders: { [key: string]: string[] };
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [folders, setFolders] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    if (user) {
      fetchChatHistory();
    }
  }, [user]);

  const fetchChatHistory = async () => {
    try {
      const { data: chats, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert database chats to ChatSession format
      const formattedChats: ChatSession[] = chats.map(chat => ({
        id: chat.id,
        title: chat.title || 'New Chat',
        messages: chat.messages || [],
        timestamp: chat.created_at
      }));

      setChatSessions(formattedChats);

      // If there's an active chat, load its messages
      if (activeChatId) {
        const activeChat = formattedChats.find(chat => chat.id === activeChatId);
        if (activeChat) {
          setMessages(activeChat.messages);
        }
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Create a new chat if there isn't an active one
    if (!activeChatId) {
      const newChat: ChatSession = {
        id: crypto.randomUUID(),
        title: message.slice(0, 30) + '...',
        messages: [],
        timestamp: new Date().toISOString()
      };
      setChatSessions(prev => [newChat, ...prev]);
      setActiveChatId(newChat.id);
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: message,
      isAi: false,
      timestamp: new Date().toISOString()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);

    // Show typing indicator
    const typingMessage: Message = {
      id: crypto.randomUUID(),
      text: "...",
      isAi: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, typingMessage]);

    try {
      // Call chat API through Supabase Edge Function with retry logic
      let response;
      let retries = 3;

      while (retries > 0) {
        try {
          const { data, error } = await supabase.functions.invoke('chat', {
            body: { 
              message: message,
              userId: user?.id,
              system_prompt: `You are an AI Assistant experienced in React Development. You MUST follow these guidelines for EVERY response:

1. Start by clearly stating what specific React component, feature, or concept you are discussing
2. Keep your response under 15 lines total
3. Do not include any code examples
4. Do not include any technical commentary or explanations
5. Focus only on what is being built and its key features
6. Use simple, direct language

Example format:
"I am discussing [React Component/Feature].
This [component/feature] is used for [main purpose].
It includes these key features:
- Feature 1
- Feature 2
- Feature 3"

Remember: Be concise and direct. No code. No technical details.`
            }
          });

          if (error) throw error;
          if (!data || !data.response) throw new Error('No response received');

          response = data.response;
          break;
        } catch (e) {
          retries--;
          if (retries === 0) throw e;
          await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
        }
      }

      // Remove typing indicator and add AI response
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        text: response,
        isAi: true,
        timestamp: new Date().toISOString()
      };

      // Update messages state
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== typingMessage.id);
        return [...filtered, aiMessage];
      });

      // Save chat to database if user is logged in
      if (user && activeChatId) {
        const updatedMessages = messages.filter(msg => msg.id !== typingMessage.id);
        updatedMessages.push(userMessage, aiMessage);

        const { error: saveError } = await supabase
          .from('chats')
          .upsert({
            id: activeChatId,
            user_id: user.id,
            title: message.slice(0, 30) + '...',
            messages: updatedMessages,
            updated_at: new Date().toISOString()
          });

        if (saveError) {
          console.error('Error saving chat:', saveError);
        }

        // Update chat sessions
        setChatSessions(prev => prev.map(chat => 
          chat.id === activeChatId 
            ? { ...chat, messages: updatedMessages, title: message.slice(0, 30) + '...' }
            : chat
        ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Remove typing indicator and show error message
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== typingMessage.id);
        return [...filtered, {
          id: crypto.randomUUID(),
          text: "All AI services are currently unavailable. Please try again later.",
          isAi: true,
          timestamp: new Date().toISOString()
        }];
      });
    }
  };

  const createNewChat = () => {
    setMessages([]); // Clear messages immediately
    const newChat = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date()
    };
    setChatSessions(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const deleteChat = async (chatId: string) => {
    try {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId);

      if (error) throw error;

      setChatSessions(prev => prev.filter(chat => chat.id !== chatId));
      if (activeChatId === chatId) {
        setActiveChatId(null);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const renameChat = async (chatId: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from('chats')
        .update({ title: newTitle })
        .eq('id', chatId);

      if (error) throw error;

      setChatSessions(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      ));
    } catch (error) {
      console.error('Error renaming chat:', error);
    }
  };

  const toggleFavorite = (chatId: string) => {
    setFavorites(prev => 
      prev.includes(chatId) 
        ? prev.filter(id => id !== chatId)
        : [...prev, chatId]
    );
  };

  const moveToFolder = async (chatId: string, folderName: string) => {
    try {
      const { error } = await supabase
        .from('chats')
        .update({ folder_id: folderName })
        .eq('id', chatId);

      if (error) throw error;

      setFolders(prev => {
        const newFolders = { ...prev };
        // Remove from old folder
        Object.keys(newFolders).forEach(folderId => {
          newFolders[folderId] = newFolders[folderId].filter(chat => chat.id !== chatId);
        });
        // Add to new folder
        if (!newFolders[folderName]) {
          newFolders[folderName] = [];
        }
        const chat = chatSessions.find(c => c.id === chatId);
        if (chat) {
          newFolders[folderName].push(chat);
        }
        return newFolders;
      });
    } catch (error) {
      console.error('Error moving chat to folder:', error);
    }
  };

  const createFolder = (folderName: string) => {
    setFolders(prev => ({
      ...prev,
      [folderName]: []
    }));
  };

  return (
    <ChatContext.Provider value={{
      messages,
      chatSessions,
      activeChatId,
      setActiveChatId,
      handleSendMessage,
      createNewChat,
      deleteChat,
      renameChat,
      toggleFavorite,
      moveToFolder,
      createFolder,
      favorites,
      folders
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