import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, MessageSquare, Trash2, ChevronRight, Plus, Trash } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ChatFolder {
  id: string;
  name: string;
  chats: Chat[];
  isExpanded: boolean;
}

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  folderId: string;
}

export const ChatHistory = () => {
  const { currentChat, setCurrentChat, setChatHistory } = useChat();
  const { user } = useAuth();
  const [folders, setFolders] = useState<ChatFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

      // Group chats by folder
      const groupedChats = chats.reduce((acc: { [key: string]: Chat[] }, chat) => {
        const folderId = chat.folder_id || 'default';
        if (!acc[folderId]) {
          acc[folderId] = [];
        }
        acc[folderId].push({
          id: chat.id,
          title: chat.title || 'New Chat',
          lastMessage: chat.last_message || '',
          timestamp: chat.created_at,
          folderId: folderId
        });
        return acc;
      }, {});

      // Create folder structure
      const folderStructure = Object.entries(groupedChats).map(([folderId, chats]) => ({
        id: folderId,
        name: folderId === 'default' ? 'All Chats' : 'Custom Folder',
        chats,
        isExpanded: true
      }));

      setFolders(folderStructure);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!user) return;

    try {
      // Delete all chats from Supabase
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      // Clear local state
      setFolders([]);
      setChatHistory([]);
      setCurrentChat(null);
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  };

  const handleChatClick = (chat: Chat) => {
    setCurrentChat(chat);
  };

  const toggleFolder = (folderId: string) => {
    setFolders(folders.map(folder => 
      folder.id === folderId 
        ? { ...folder, isExpanded: !folder.isExpanded }
        : folder
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B5CF6]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-[#2A2A2A]">
        <h2 className="text-lg font-semibold text-white">Chat History</h2>
        <button
          onClick={handleClearHistory}
          className="p-2 rounded-lg hover:bg-[#2A2A2A] transition-colors duration-200"
          title="Clear all chats"
        >
          <Trash2 className="w-5 h-5 text-red-500" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence>
          {folders.map(folder => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4"
            >
              <button
                onClick={() => toggleFolder(folder.id)}
                className="flex items-center w-full p-2 rounded-lg hover:bg-[#2A2A2A] transition-colors duration-200"
              >
                <Folder className="w-5 h-5 text-[#8B5CF6] mr-2" />
                <span className="flex-1 text-left text-white">{folder.name}</span>
                <ChevronRight
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    folder.isExpanded ? 'rotate-90' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {folder.isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 mt-2 space-y-2"
                  >
                    {folder.chats.map(chat => (
                      <motion.button
                        key={chat.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        onClick={() => handleChatClick(chat)}
                        className={`flex items-center w-full p-2 rounded-lg transition-colors duration-200 ${
                          currentChat?.id === chat.id
                            ? 'bg-[#8B5CF6]/20 text-white'
                            : 'hover:bg-[#2A2A2A] text-gray-400 hover:text-white'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        <span className="flex-1 text-left truncate">{chat.title}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}; 