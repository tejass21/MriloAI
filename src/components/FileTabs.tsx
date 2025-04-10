import React from 'react';
import { useSandpack } from '@codesandbox/sandpack-react';
import { File, X } from 'lucide-react';

interface FileTabsProps {
  onClose?: (path: string) => void;
}

export const FileTabs: React.FC<FileTabsProps> = ({ onClose }) => {
  const { sandpack } = useSandpack();
  const { activeFile, setActiveFile, files } = sandpack;

  return (
    <div className="flex overflow-x-auto bg-[#1A1A1A] border-b border-[#2A2A2A]">
      {Object.keys(files).map((path) => {
        const isActive = path === activeFile;
        const fileName = path.split('/').pop() || '';

        if (files[path].hidden) return null;

        return (
          <button
            key={path}
            onClick={() => setActiveFile(path)}
            className={`flex items-center space-x-2 px-4 py-2 min-w-[120px] text-sm ${
              isActive
                ? 'bg-[#2A2A2A] text-white border-t-2 border-[#8B5CF6]'
                : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]/50'
            }`}
          >
            <File size={14} />
            <span className="truncate">{fileName}</span>
            {onClose && isActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(path);
                }}
                className="ml-2 p-1 rounded-full hover:bg-[#3A3A3A]"
              >
                <X size={12} />
              </button>
            )}
          </button>
        );
      })}
    </div>
  );
}; 