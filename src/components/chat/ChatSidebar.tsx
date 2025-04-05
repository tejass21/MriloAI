import { useEffect, useState } from "react";
import { Edit, MessageSquare, Plus, Trash2, Star, StarOff, Search, MoreVertical, FolderPlus, FolderOpen, Home, Compass, Users, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ActionSearchBar } from "@/components/ui/action-search-bar";
import { ChatSession } from "@/types/chat";
import { ActionType } from "@/types/action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExploreAI } from '../explore/ExploreAI';
import { Link } from "react-router-dom";

interface ChatSidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  chatSessions: ChatSession[];
  activeChatId: string | null;
  setActiveChatId: (id: string) => void;
  handleNewChat: () => void;
  allActions: ActionType[];
  handleSendMessage: (message: string) => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
  onToggleFavorite: (chatId: string) => void;
  onMoveToFolder: (chatId: string, folderName: string) => void;
  onCreateFolder: (folderName: string) => void;
  favorites: string[];
  folders: { [key: string]: string[] };
}

export const ChatSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  chatSessions,
  activeChatId,
  setActiveChatId,
  handleNewChat,
  allActions,
  handleSendMessage,
  onDeleteChat,
  onRenameChat,
  onToggleFavorite,
  onMoveToFolder,
  onCreateFolder,
  favorites,
  folders,
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Filter chats based on search query
  const filteredChats = chatSessions.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.messages.some(msg => msg.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Group chats by date
  const groupedChats = filteredChats.reduce((acc, chat) => {
    const date = new Date(chat.timestamp);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    let category = 'older';
    
    if (date.toDateString() === today.toDateString()) {
      category = 'today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      category = 'yesterday';
    }
    
    if (!acc[category]) {
      acc[category] = [];
    }
    
    acc[category].push(chat);
    return acc;
  }, {} as Record<string, ChatSession[]>);

  // Function to get chat preview text
  const getChatPreview = (chat: ChatSession) => {
    const lastMessage = chat.messages[chat.messages.length - 1];
    if (!lastMessage) return "New Chat";

    if (lastMessage.codeBlocks && lastMessage.codeBlocks.length > 0) {
      const firstCodeBlock = lastMessage.codeBlocks[0];
      return `${firstCodeBlock.language} code: ${firstCodeBlock.code.slice(0, 30)}...`;
    }

    return lastMessage.text.slice(0, 30) + (lastMessage.text.length > 30 ? "..." : "");
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName);
      setNewFolderName("");
      setIsCreatingFolder(false);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[280px] sm:w-[300px] md:w-[320px] bg-[#1A1A1A] border-r border-[#2A2A2A] flex flex-col h-full transition-all duration-300 ease-in-out lg:relative lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* New Chat Button */}
        <div className="flex items-center p-3 sm:p-4 border-b border-[#2A2A2A]">
          <h1 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-white to-[#8B5CF6] bg-clip-text text-transparent">Chats</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-auto text-gray-300 hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-all duration-300"
            onClick={handleNewChat}
          >
            <Edit className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">New Chat</span>
          </Button>
        </div>

        {/* Navigation Section */}
        <div className="flex flex-col gap-1 p-2 border-b border-[#2A2A2A]">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "w-full justify-start text-gray-300 hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-all duration-300",
              activeSection === "home" && "text-[#8B5CF6] bg-[#8B5CF6]/10"
            )}
            onClick={() => setActiveSection("home")}
          >
            <Home className="w-4 h-4 mr-2" />
            <span>Dashboard</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "w-full justify-start text-gray-300 hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-all duration-300",
              activeSection === "discover" && "text-[#8B5CF6] bg-[#8B5CF6]/10"
            )}
            onClick={() => setActiveSection("discover")}
          >
            <Compass className="w-4 h-4 mr-2" />
            <span>Explore AI</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "w-full justify-start text-gray-300 hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-all duration-300",
              activeSection === "spaces" && "text-[#8B5CF6] bg-[#8B5CF6]/10"
            )}
            onClick={() => setActiveSection("spaces")}
          >
            <Users className="w-4 h-4 mr-2" />
            <span>Team Workspace</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "w-full justify-start text-gray-300 hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-all duration-300",
              activeSection === "library" && "text-[#8B5CF6] bg-[#8B5CF6]/10"
            )}
            onClick={() => setActiveSection("library")}
          >
            <Library className="w-4 h-4 mr-2" />
            <span>My Conversations</span>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="p-2 border-b border-[#2A2A2A]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg text-sm text-gray-300 placeholder:text-gray-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
            />
          </div>
        </div>

        {/* Folder Creation */}
        {isCreatingFolder && (
          <div className="p-2 border-b border-[#2A2A2A]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg text-sm text-gray-300 placeholder:text-gray-500 focus:outline-none focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6]"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCreateFolder}
                className="text-gray-300 hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10"
              >
                Create
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsCreatingFolder(false)}
                className="text-gray-300 hover:text-red-400 hover:bg-red-400/10"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        <ScrollArea className="flex-1">
          <div className="py-2">
            {activeSection === "library" && (
              <>
                {/* Favorites Section */}
                {favorites.length > 0 && (
                  <>
                    <h3 className="text-xs uppercase font-medium text-gray-400 dark:text-gray-500 px-3 pt-4 sm:pt-5 pb-2">Favorites</h3>
                    <div className="space-y-1 px-2">
                      {favorites.map(chatId => {
                        const chat = chatSessions.find(c => c.id === chatId);
                        if (!chat) return null;
                        return (
                          <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={activeChatId === chat.id}
                            onSelect={() => setActiveChatId(chat.id)}
                            onDelete={() => onDeleteChat(chat.id)}
                            onRename={(newTitle) => onRenameChat(chat.id, newTitle)}
                            onToggleFavorite={() => onToggleFavorite(chat.id)}
                            onMoveToFolder={onMoveToFolder}
                            folders={folders}
                            getChatPreview={getChatPreview}
                            isFavorite={favorites.includes(chat.id)}
                          />
                        );
                      })}
                    </div>
                  </>
                )}

                {/* Today's chats */}
                {groupedChats.today && groupedChats.today.length > 0 && (
                  <>
                    <h3 className="text-xs uppercase font-medium text-gray-400 dark:text-gray-500 px-3 pt-4 sm:pt-5 pb-2">Today</h3>
                    <div className="space-y-1 px-2">
                      {groupedChats.today.map((chat) => (
                        <ChatItem
                          key={chat.id}
                          chat={chat}
                          isActive={activeChatId === chat.id}
                          onSelect={() => setActiveChatId(chat.id)}
                          onDelete={() => onDeleteChat(chat.id)}
                          onRename={(newTitle) => onRenameChat(chat.id, newTitle)}
                          onToggleFavorite={() => onToggleFavorite(chat.id)}
                          onMoveToFolder={onMoveToFolder}
                          folders={folders}
                          getChatPreview={getChatPreview}
                          isFavorite={favorites.includes(chat.id)}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                {/* Yesterday's chats */}
                {groupedChats.yesterday && groupedChats.yesterday.length > 0 && (
                  <>
                    <h3 className="text-xs uppercase font-medium text-gray-400 dark:text-gray-500 px-3 pt-4 sm:pt-5 pb-2">Yesterday</h3>
                    <div className="space-y-1 px-2">
                      {groupedChats.yesterday.map((chat) => (
                        <ChatItem
                          key={chat.id}
                          chat={chat}
                          isActive={activeChatId === chat.id}
                          onSelect={() => setActiveChatId(chat.id)}
                          onDelete={() => onDeleteChat(chat.id)}
                          onRename={(newTitle) => onRenameChat(chat.id, newTitle)}
                          onToggleFavorite={() => onToggleFavorite(chat.id)}
                          onMoveToFolder={onMoveToFolder}
                          folders={folders}
                          getChatPreview={getChatPreview}
                          isFavorite={favorites.includes(chat.id)}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                {/* Older chats */}
                {groupedChats.older && groupedChats.older.length > 0 && (
                  <>
                    <h3 className="text-xs uppercase font-medium text-gray-400 dark:text-gray-500 px-3 pt-4 sm:pt-5 pb-2">Older</h3>
                    <div className="space-y-1 px-2">
                      {groupedChats.older.map((chat) => (
                        <ChatItem
                          key={chat.id}
                          chat={chat}
                          isActive={activeChatId === chat.id}
                          onSelect={() => setActiveChatId(chat.id)}
                          onDelete={() => onDeleteChat(chat.id)}
                          onRename={(newTitle) => onRenameChat(chat.id, newTitle)}
                          onToggleFavorite={() => onToggleFavorite(chat.id)}
                          onMoveToFolder={onMoveToFolder}
                          folders={folders}
                          getChatPreview={getChatPreview}
                          isFavorite={favorites.includes(chat.id)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {activeSection === "home" && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
                <h3 className="text-lg font-medium text-gray-300 mb-2">Welcome to Mrilo AI</h3>
                <p className="text-sm text-gray-400">Start a new chat or continue from your library</p>
              </div>
            )}

            {activeSection === "discover" && (
              <div className="flex flex-col h-full">
                <ExploreAI />
              </div>
            )}

            {activeSection === "spaces" && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
                <div className="space-y-2 w-full">
                  <Link
                    to="/explore"
                    className="flex items-center gap-2 p-3 rounded-lg bg-[#2A2A2A] hover:bg-[#8B5CF6]/20 transition-colors duration-300 text-gray-300 hover:text-white w-full"
                  >
                    <Users className="w-5 h-5" />
                    <span className="font-medium">Team Workspace</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Sidebar Footer */}
        <div className="p-2 border-t border-[#2A2A2A]">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-gray-300 hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-all duration-300"
            onClick={() => setIsCreatingFolder(true)}
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            Create Folder
          </Button>
        </div>

        {/* Close sidebar button for mobile */}
        <div className="p-2 sm:p-3 border-t border-[#2A2A2A] lg:hidden">
          <Button 
            variant="outline" 
            className="w-full text-gray-300 border-[#2A2A2A] hover:bg-[#8B5CF6]/10 hover:text-[#8B5CF6] transition-all duration-300" 
            onClick={() => setIsSidebarOpen(false)}
          >
            Close Menu
          </Button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </>
  );
};

// ChatItem component for better organization
const ChatItem = ({
  chat,
  isActive,
  onSelect,
  onDelete,
  onRename,
  onToggleFavorite,
  onMoveToFolder,
  folders,
  getChatPreview,
  isFavorite,
}: {
  chat: ChatSession;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (newTitle: string) => void;
  onToggleFavorite: () => void;
  onMoveToFolder: (chatId: string, folderName: string) => void;
  folders: { [key: string]: string[] };
  getChatPreview: (chat: ChatSession) => string;
  isFavorite: boolean;
}) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(chat.title);

  const handleRename = () => {
    if (newTitle.trim() && newTitle !== chat.title) {
      onRename(newTitle);
    }
    setIsRenaming(false);
  };

  const handleSelect = () => {
    onSelect();
    // Scroll to top of chat container
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      chatContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="group relative">
      <button
        onClick={handleSelect}
        className={cn(
          "w-full px-2 sm:px-3 py-2 sm:py-2.5 text-left text-sm transition-all duration-300 rounded-lg flex items-center gap-2",
          isActive 
            ? "bg-[#8B5CF6]/20 text-white" 
            : "text-gray-300 hover:bg-[#8B5CF6]/10 hover:text-white"
        )}
      >
        <MessageSquare size={16} />
        <div className="flex flex-col items-start flex-1 min-w-0">
          {isRenaming ? (
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
              className="w-full bg-transparent border-none focus:outline-none text-sm"
              autoFocus
            />
          ) : (
            <span className="truncate">{chat.title}</span>
          )}
          <span className="text-xs text-gray-500 truncate">{getChatPreview(chat)}</span>
        </div>
      </button>

      {/* Chat item actions */}
      <div className="flex items-center gap-1 px-2 pb-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 h-8 text-gray-400 hover:text-white hover:bg-[#8B5CF6]/10"
          onClick={(e) => {
            e.stopPropagation();
            setIsRenaming(true);
          }}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 h-8 text-gray-400 hover:text-white hover:bg-[#8B5CF6]/10"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
        >
          {isFavorite ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 h-8 text-gray-400 hover:text-white hover:bg-[#8B5CF6]/10"
          onClick={(e) => {
            e.stopPropagation();
            onMoveToFolder(chat.id, Object.keys(folders)[0]);
          }}
        >
          <FolderOpen className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 h-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
