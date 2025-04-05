import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, Paperclip, Sparkles } from "lucide-react";
import { useState, FormEvent, useRef, useEffect } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSendMessage, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when disabled state changes to false (after loading)
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Add click handler to focus input
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current && !disabled) {
        inputRef.current.focus();
      }
    };

    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('click', handleClick);
    }

    return () => {
      if (form) {
        form.removeEventListener('click', handleClick);
      }
    };
  }, [disabled]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if ((message.trim() || selectedFile) && !disabled) {
      if (selectedFile) {
        const fileMessage = `[Image Upload] ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(2)} KB)`;
        onSendMessage(fileMessage);
        setSelectedFile(null);
      }
      if (message.trim()) {
        onSendMessage(message);
      }
      setMessage("");
    }
  };

  const handleFileButtonClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false;
    input.style.display = 'none';
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        if (file.type.startsWith('image/')) {
          setSelectedFile(file);
        }
      }
    };

    input.click();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full group">
      <div className="relative flex items-center rounded-2xl border border-[#2A2A2A] bg-[#1A1A1A] shadow-lg transition-all duration-300 group-hover:border-gray-600 group-focus-within:border-[#8B5CF6]/50 group-focus-within:shadow-[#8B5CF6]/5 group-focus-within:scale-[1.02]">
        {/* Animated background glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#8B5CF6]/0 via-[#8B5CF6]/5 to-[#8B5CF6]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Action buttons with hover effects */}
        <div className="absolute left-2 flex items-center gap-2 z-10">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="relative h-10 w-10 rounded-full text-gray-400 hover:bg-gray-700/30 transition-all duration-300 group/clip"
            onClick={handleFileButtonClick}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8B5CF6]/0 via-[#8B5CF6]/10 to-[#8B5CF6]/0 opacity-0 group-hover/clip:opacity-100 transition-opacity duration-300" />
            <Paperclip className="h-5 w-5 transition-all duration-300 group-hover/clip:scale-110 group-hover/clip:text-[#8B5CF6] group-hover/clip:-rotate-12" />
          </Button>
        </div>

        {/* Enhanced input with focus effects */}
        <Input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={selectedFile ? `Selected Image: ${selectedFile.name}` : "Ask anything..."}
          disabled={disabled}
          className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pl-12 pr-4 py-4 text-sm sm:text-base text-gray-300 placeholder:text-gray-500 h-[52px]"
        />

        {/* Submit button with enhanced styling */}
        <div className="absolute right-2 flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="relative h-10 w-10 rounded-full text-gray-400 hover:bg-gray-700/30 transition-all duration-300 group/sparkles"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8B5CF6]/0 via-[#8B5CF6]/10 to-[#8B5CF6]/0 opacity-0 group-hover/sparkles:opacity-100 transition-opacity duration-300" />
            <Sparkles className="h-5 w-5 transition-all duration-300 group-hover/sparkles:scale-110 group-hover/sparkles:text-[#8B5CF6] group-hover/sparkles:-rotate-12" />
          </Button>
          <Button 
            type="submit" 
            size="icon"
            disabled={(!message.trim() && !selectedFile) || disabled}
            className="relative h-10 w-10 rounded-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 transition-all duration-300 disabled:opacity-30 group/submit z-20 shadow-lg shadow-[#8B5CF6]/20"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8B5CF6]/0 via-[#8B5CF6]/20 to-[#8B5CF6]/0 opacity-0 group-hover/submit:opacity-100 transition-opacity duration-300" />
            <ArrowUp className="h-5 w-5 text-white transition-all duration-300 group-hover/submit:scale-110 group-hover/submit:text-white group-hover/submit:-translate-y-0.5" />
          </Button>
        </div>
      </div>
    </form>
  );
};
