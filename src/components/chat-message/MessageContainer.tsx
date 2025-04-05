import React from "react";
import { cn } from "@/lib/utils";
import { Source } from "@/types/chat";
import { AiMessageContent } from "./AiMessageContent";
import { UserMessageContent } from "./UserMessageContent";
import { CodeMessageContent } from "./CodeMessageContent";
import { motion } from "framer-motion";
import { userMessageVariants, aiMessageVariants, glowVariants } from "@/lib/animations";

interface MessageContainerProps {
  message: string;
  isAi: boolean;
  sources?: Source[];
  codeBlocks?: { language: string; code: string; }[];
}

export const MessageContainer = ({ message, isAi, sources = [], codeBlocks }: MessageContainerProps) => {
  // Check if the message contains code or has code blocks
  const hasCode = message.includes('```') || (codeBlocks && codeBlocks.length > 0);

  return (
    <motion.div
      variants={isAi ? aiMessageVariants : userMessageVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={cn(
        "max-w-[98%] xs:max-w-[95%] sm:max-w-[90%] w-full relative group",
        isAi ? "rounded-tl-sm" : "rounded-tr-sm",
        !hasCode && "px-3 py-2.5 sm:px-4 sm:py-3 rounded-2xl",
        !hasCode && (isAi 
          ? "bg-[#1A1A1A] text-white hover:bg-[#1E1E1E] transition-colors duration-300" 
          : "bg-[#8B5CF6]/10 text-white hover:bg-[#8B5CF6]/15 transition-colors duration-300"
        ),
        "shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-[#8B5CF6]/5"
      )}
    >
      {/* Enhanced glow effects */}
      <motion.div 
        variants={glowVariants}
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl",
          isAi 
            ? "bg-gradient-to-r from-[#2A2A2A]/0 via-[#2A2A2A]/50 to-[#2A2A2A]/0" 
            : "bg-gradient-to-r from-[#8B5CF6]/0 via-[#8B5CF6]/10 to-[#8B5CF6]/0"
        )} 
      />
      
      {/* Radial glow effect */}
      <motion.div 
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
          isAi
            ? "bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"
            : "bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]"
        )}
      />

      {/* Content with enhanced hover effects */}
      <div className="relative">
        {hasCode ? (
          <CodeMessageContent message={message} codeBlocks={codeBlocks} />
        ) : (
          <motion.div 
            className="w-full"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            {isAi ? (
              <AiMessageContent message={message} sources={sources} />
            ) : (
              <UserMessageContent message={message} />
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
