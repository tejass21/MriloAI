import { Menu, Plus, Sparkles, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AuthModal } from "@/components/auth/AuthModal";
import { useUser } from "@/contexts/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';

interface ChatHeaderProps {
  setIsSidebarOpen: (open: boolean) => void;
  isSidebarOpen: boolean;
  handleNewChat: () => void;
}

export const ChatHeader = ({ 
  setIsSidebarOpen, 
  isSidebarOpen,
  handleNewChat 
}: ChatHeaderProps) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, setUser } = useUser();

  const handleSignOut = () => {
    setUser(null);
  };
  return (
    <>
      <nav className="border-b border-[#2A2A2A] bg-[#1A1A1A] sticky top-0 z-30 w-full">
        <div className="flex h-14 sm:h-16 items-center justify-between px-2 sm:px-4 max-w-screen-xl mx-auto">
          {/* Left section with menu and logo */}
          <div className="flex items-center flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="mr-1 sm:mr-2 h-8 w-8 sm:h-9 sm:w-9 text-gray-300 hover:bg-[#8B5CF6]/10 hover:text-[#8B5CF6] lg:hidden flex-shrink-0"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={18} className="sm:w-5 sm:h-5" />
            </Button>
            <div className="flex items-center gap-1.5 sm:gap-3">
              <button 
                onClick={() => window.open('https://mrilo.netlify.app', '_self')}
                className="flex items-center gap-1.5 sm:gap-3 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <img 
                  src="/logo.svg" 
                  alt="MRILO" 
                  className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10"
                />
                <span className="font-semibold text-sm sm:text-base md:text-lg tracking-wide bg-gradient-to-r from-white to-[#8B5CF6] bg-clip-text text-transparent whitespace-nowrap">
                  MRILO AI
                </span>
              </button>
            </div>
          </div>
          
          {/* Right section with buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-all duration-300"
              onClick={handleNewChat}
            >
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">New Chat</span>
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 hover:bg-[#8B5CF6]/10 px-2"
                  >
                    <div className="relative">
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="w-8 h-8 rounded-full ring-2 ring-[#8B5CF6]/20"
                      />
                      <div className="absolute inset-0 rounded-full ring-2 ring-[#8B5CF6]/20 animate-pulse"></div>
                    </div>
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-200">{user.name}</span>
                      <span className="text-xs text-gray-400">{user.email}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#1A1A1A] border-[#2A2A2A] w-56">
                  <div className="px-2 py-1.5 border-b border-[#2A2A2A]">
                    <div className="text-sm font-medium text-gray-200">{user.name}</div>
                    <div className="text-xs text-gray-400 truncate">{user.email}</div>
                  </div>
                  <DropdownMenuItem
                    className="text-gray-300 hover:text-white hover:bg-[#8B5CF6]/10 cursor-pointer"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-white transition-all duration-300 flex items-center gap-2 px-2 sm:px-3"
                onClick={() => setIsAuthModalOpen(true)}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="hidden sm:inline">Sign up with Google</span>
              </Button>
            )}
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};
