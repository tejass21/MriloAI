
import React from "react";
import { Source } from "@/types/chat";
import { ExternalLink, FileText, Video, Image as ImageIcon, Globe } from "lucide-react";

interface SourceCardProps {
  source: Source;
  index: number;
}

export const SourceCard = ({ source, index }: SourceCardProps) => {
  // Get source icon based on type
  const getSourceIcon = (source: Source) => {
    if (source.type === 'video') return <Video className="w-3 h-3 mr-1 text-blue-400" />;
    if (source.type === 'image') return <ImageIcon className="w-3 h-3 mr-1 text-green-400" />;
    if (source.type === 'document') return <FileText className="w-3 h-3 mr-1 text-orange-400" />;
    return <Globe className="w-3 h-3 mr-1 text-blue-400" />;
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-3 text-sm">
      {source.url ? (
        <a 
          href={source.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-start group"
        >
          <div className="mr-2 mt-0.5 flex-shrink-0">
            <div className="h-5 w-5 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-white text-xs">{index + 1}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-blue-400 group-hover:underline font-medium line-clamp-1">
              {source.title || source.url}
            </span>
            {source.text && (
              <span className="text-gray-400 text-xs line-clamp-2 mt-1">{source.text}</span>
            )}
            <div className="flex items-center mt-1 text-gray-500 text-xs">
              {getSourceIcon(source)}
              <span className="truncate">{source.url}</span>
            </div>
          </div>
        </a>
      ) : (
        <div className="flex items-start">
          <div className="mr-2 mt-0.5 flex-shrink-0">
            <div className="h-5 w-5 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-white text-xs">{index + 1}</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-medium line-clamp-1">
              {source.title || "Source " + (index + 1)}
            </span>
            {source.text && (
              <span className="text-gray-400 text-xs line-clamp-2 mt-1">{source.text}</span>
            )}
          </div>
        </div>
      )}
      {source.image && (
        <div className="mt-2">
          <img 
            src={source.image} 
            alt={source.title || "Source image"} 
            className="rounded-md w-full h-24 object-cover"
          />
        </div>
      )}
    </div>
  );
};
