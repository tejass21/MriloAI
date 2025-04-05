import React from "react";
import { motion } from "framer-motion";
import { Source } from "@/types/chat";
import { ExternalLink } from "lucide-react";

interface SourceListProps {
  sources: Source[];
}

export const SourceList = ({ sources }: SourceListProps) => {
  if (sources.length === 0) return null;

  return (
    <motion.div 
      className="mt-4 space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <motion.h4 
        className="text-xs font-medium text-gray-400 flex items-center gap-2"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-[#00FFD1]" />
        Sources
      </motion.h4>
      
      <motion.div 
        className="grid gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {sources.map((source, index) => (
          <motion.a
            key={index}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-xs text-gray-400 hover:text-[#00FFD1] transition-colors duration-200"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ x: 5 }}
          >
            <motion.div 
              className="h-1.5 w-1.5 rounded-full bg-[#00FFD1]/30 group-hover:bg-[#00FFD1] transition-colors duration-200"
              whileHover={{ scale: 1.2 }}
            />
            <span className="truncate">{source.title}</span>
            <motion.div
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              whileHover={{ scale: 1.1 }}
            >
              <ExternalLink className="h-3 w-3" />
            </motion.div>
          </motion.a>
        ))}
      </motion.div>
    </motion.div>
  );
};
