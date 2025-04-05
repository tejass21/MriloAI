import React from "react";
import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { MessageContainer } from "../chat-message/MessageContainer";
import { motion, AnimatePresence } from "framer-motion";
import { messageVariants, containerVariants } from "@/lib/animations";

interface ChatConversationProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef?: React.RefObject<HTMLDivElement>;
}

export const ChatConversation = ({ messages, isLoading, messagesEndRef }: ChatConversationProps) => {
  return (
    <motion.div 
      className="bg-white dark:bg-[#121212] relative overflow-hidden transition-colors duration-300 chat-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Animated background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#8B5CF6]/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_50%)] pointer-events-none animate-pulse-slow" />
      </div>
      
      <div className="flex flex-col gap-4 p-4">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex",
                message.isAi ? "justify-start" : "justify-end"
              )}
            >
              <MessageContainer
                message={message.text}
                isAi={message.isAi}
                sources={message.sources}
                codeBlocks={message.codeBlocks}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {isLoading && (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B5CF6]" />
        </div>
      )}
      
      <div ref={messagesEndRef || undefined} id="messages-end" className="h-32" />
    </motion.div>
  );
};
