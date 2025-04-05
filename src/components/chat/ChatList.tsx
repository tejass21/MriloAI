import React from 'react';
import { MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
}

interface ChatListProps {
  chats: Chat[];
  onSelectChat: (id: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, onSelectChat }) => {
  return (
    <div className="space-y-2">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onSelectChat(chat.id)}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-lg",
            "text-left transition-all duration-300",
            "hover:bg-[#8B5CF6]/10 hover:text-[#8B5CF6]",
            "group"
          )}
        >
          <div className="p-2 rounded-lg bg-[#2A2A2A] group-hover:bg-[#8B5CF6]/20 transition-colors duration-300">
            <MessageSquare className="h-4 w-4 text-gray-400 group-hover:text-[#8B5CF6]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate text-gray-300 group-hover:text-[#8B5CF6]">
              {chat.title}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {chat.lastMessage}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ChatList; 