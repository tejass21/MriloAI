import React from "react";
import { motion } from "framer-motion";

interface UserMessageContentProps {
  message: string;
}

export const UserMessageContent = ({ message }: UserMessageContentProps) => {
  return (
    <motion.div 
      className="relative group"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ scale: 1.01 }}
    >
      {/* Enhanced glow effects */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/0 via-[#8B5CF6]/10 to-[#8B5CF6]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl rounded-lg"
        whileHover={{ opacity: 1 }}
      />
      
      {/* Radial glow effect */}
      <motion.div 
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"
        whileHover={{ opacity: 1 }}
      />
      
      {/* Message content with animations */}
      <div className="relative leading-relaxed whitespace-pre-wrap break-words text-sm sm:text-base p-3 rounded-lg">
        <motion.div 
          className="flex items-center gap-2 mb-1 text-[#8B5CF6]/70"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="h-2 w-2 rounded-full bg-[#8B5CF6]"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <span className="text-xs font-medium">You</span>
        </motion.div>
        
        <motion.div 
          className="transform transition-all duration-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.div>
      </div>
    </motion.div>
  );
};
