import React from "react";
import { motion } from "framer-motion";
import { Source } from "@/types/chat";
import { SourceList } from "./SourceList";
import { Sparkles } from "lucide-react";

interface AiMessageContentProps {
  message: string;
  sources?: Source[];
}

export const AiMessageContent = ({ message, sources = [] }: AiMessageContentProps) => {
  // Format message to improve readability with better formatting and highlighting
  const formattedMessage = message
    // Detect and highlight headings with bolder formatting
    .replace(/^(#+)\s+(.*?)$/gm, (_, hashes, text) => {
      const headingLevel = hashes.length;
      const fontSize = 5 - headingLevel > 0 ? 5 - headingLevel : 0;
      return `<h${headingLevel} class="font-bold text-${fontSize + 12}px mt-4 mb-2">${text}</h${headingLevel}>`;
    })
    // Enhance bold text formatting
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
    // Convert bullet points to enhanced styled list items
    .replace(/\n\s*\*\s+(.*?)(?=\n|$)/g, '\n<li class="ml-4 pl-2 py-1 border-l-2 border-gray-600 mb-2">$1</li>')
    // Handle numbered lists with better styling
    .replace(/\n\s*(\d+)\.\s+(.*?)(?=\n|$)/g, '\n<li class="ml-4 pl-2 py-1 flex gap-2 mb-2"><span class="text-gray-400">$1.</span><span>$2</span></li>')
    // Group list items and add spacing
    .replace(/(<li.*?>.*?<\/li>)(\n<li.*?>)/g, '$1$2')
    // Wrap adjacent list items in ul tags for better styling
    .replace(/(<li.*?>.*?<\/li>)+/g, '<ul class="my-3 space-y-1">$&</ul>')
    // Add extra space between paragraphs for readability
    .replace(/\n\n/g, '\n\n<div class="my-3"></div>\n\n')
    // Highlight important phrases with subtle highlight
    .replace(/\*([^*\n]+)\*/g, '<em class="text-blue-300 not-italic">$1</em>')
    // Ensure proper spacing between sections
    .replace(/\n{3,}/g, '\n\n');

  return (
    <motion.div 
      className="flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* MRILO AI Header with animation */}
      <motion.div 
        className="flex items-center gap-2 mb-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          className="h-6 w-6 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#8B5CF6]/50 flex items-center justify-center relative overflow-hidden"
          whileHover={{ scale: 1.1 }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/0 via-[#8B5CF6]/20 to-[#8B5CF6]/0"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <Sparkles className="h-4 w-4 text-white relative z-10" />
        </motion.div>
        <motion.div 
          className="flex items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-sm font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            MRILO
          </span>
          <span className="text-sm font-medium text-[#8B5CF6]">
            AI
          </span>
        </motion.div>
      </motion.div>

      {/* Answer Content with enhanced formatting and animations */}
      <motion.div 
        className="space-y-4 mb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div 
          className="leading-relaxed break-words text-sm sm:text-base prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300"
          dangerouslySetInnerHTML={{ __html: formattedMessage }}
        />
      </motion.div>
      
      {/* Sources Section with animation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <SourceList sources={sources} />
      </motion.div>
    </motion.div>
  );
};
