import { useState, useEffect } from "react";
import { PlaneTakeoff, BarChart2, Globe, Video, AudioLines } from "lucide-react";
import { ChatInput } from "@/components/ChatInput";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { WelcomeScreen } from "@/components/chat/WelcomeScreen";
import { ChatConversation } from "@/components/chat/ChatConversation";
import { useChat } from "@/hooks/use-chat";
import { ActionType } from "@/types/action";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    messages,
    isLoading,
    chatSessions,
    activeChatId,
    setActiveChatId,
    handleNewChat,
    handleSendMessage,
    messagesEndRef,
    chatContainerRef,
    setMessages,
    setInput,
    inputRef,
    setIsLoading,
    onDeleteChat,
    onRenameChat,
    onToggleFavorite,
    onMoveToFolder,
    onCreateFolder,
    favorites,
    folders,
  } = useChat();

  // Sample actions
  const allActions: ActionType[] = [
    {
      id: "1",
      label: "Book tickets",
      icon: <PlaneTakeoff className="h-4 w-4 text-blue-500" />,
      description: "Operator",
      short: "⌘K",
      end: "Agent",
    },
    {
      id: "2",
      label: "Summarize",
      icon: <BarChart2 className="h-4 w-4 text-orange-500" />,
      description: "mrilo",
      short: "⌘cmd+p",
      end: "Command",
    }
  ];

  // Add a dark class to the document body
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);

  // Function to handle suggestion button clicks
  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="flex h-[100dvh] w-full bg-white dark:bg-[#121212] transition-colors duration-300">
      {/* Sidebar */}
      <ChatSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        chatSessions={chatSessions}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        handleNewChat={handleNewChat}
        allActions={allActions}
        handleSendMessage={handleSendMessage}
        onDeleteChat={onDeleteChat}
        onRenameChat={onRenameChat}
        onToggleFavorite={onToggleFavorite}
        onMoveToFolder={onMoveToFolder}
        onCreateFolder={onCreateFolder}
        favorites={favorites}
        folders={folders}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full h-full">
        {/* Header */}
        <ChatHeader
          setIsSidebarOpen={setIsSidebarOpen}
          isSidebarOpen={isSidebarOpen}
          handleNewChat={handleNewChat}
        />

        {/* Chat Area */}
        <div className="flex-1 relative overflow-hidden">
          <div 
            ref={chatContainerRef}
            className="absolute inset-0 overflow-y-auto scrollbar-thin"
          >
            <div className="flex flex-col min-h-full">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="max-w-3xl w-full mx-auto flex flex-col items-center">
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#8B5CF6]/5 via-transparent to-transparent animate-pulse" />
                    
                    {/* Main content */}
                    <div className="relative">
                      <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-[#8B5CF6] to-gray-900 dark:from-white dark:via-[#8B5CF6] dark:to-white bg-clip-text text-transparent mt-10 mb-3 fade-in-animation animate-gradient">
                        Where Knowledge Evolves
                      </h2>
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#8B5CF6]/0 via-[#8B5CF6]/10 to-[#8B5CF6]/0 blur-xl animate-pulse" />
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-xl fade-in-animation delay-100">
                      Experience the next generation of AI assistance. Ask anything, get intelligent answers.
                    </p>
                    
                    <div className="w-full max-w-2xl mx-auto mb-12 fade-in-animation delay-200 relative group">
                      {/* Animated focus ring */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8B5CF6]/0 via-[#8B5CF6]/30 to-[#8B5CF6]/0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity animate-gradient" />
                      <div className="relative">
                        <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
                      </div>
                    </div>

                    {/* Quick actions grid */}
                    <div className="w-full max-w-2xl mx-auto space-y-6 fade-in-animation delay-300">
                      <h3 className="text-gray-400 text-sm font-medium text-left">Quick Actions</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {allActions.map((action) => (
                          <button
                            key={action.id}
                            onClick={() => handleSuggestionClick(action.label)}
                            className="flex items-center gap-3 p-3 rounded-lg bg-[#1A1A1A]/50 hover:bg-[#1A1A1A] border border-[#2A2A2A] hover:border-[#8B5CF6]/30 transition-all duration-300 group"
                          >
                            <div className="p-2 rounded-lg bg-[#2A2A2A] group-hover:bg-[#8B5CF6]/10 transition-colors duration-300">
                              {action.icon}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-sm font-medium text-white group-hover:text-[#8B5CF6] transition-colors duration-300">
                                {action.label}
                              </div>
                              <div className="text-xs text-gray-400">
                                {action.description}
                              </div>
                            </div>
                            {action.short && (
                              <div className="text-xs text-gray-500 group-hover:text-gray-400">
                                {action.short}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <ChatConversation messages={messages} isLoading={isLoading} />
                  <div className="sticky bottom-6 w-full max-w-3xl mx-auto px-4 pt-4">
                    <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
                  </div>
                </>
              )}
              <div ref={messagesEndRef} id="messages-end" className="h-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
