import React, { useState } from 'react';
import { FileNode } from '../utils/readFileTree';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';

interface FileTreeProps {
  tree: FileNode[];
  onFileClick: (path: string) => void;
}

interface FileTreeNodeProps {
  node: FileNode;
  onFileClick: (path: string) => void;
  level?: number;
}

const FileTreeNode: React.FC<FileTreeNodeProps> = ({ node, onFileClick, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(level === 0);

  const handleClick = () => {
    if (node.type === 'directory') {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(node.path);
    }
  };

  const getFileIcon = () => {
    if (node.type === 'directory') {
      return isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />;
    }

    // Different icons based on file extension
    const ext = node.name.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <File size={16} className="text-yellow-500" />;
      case 'css':
      case 'scss':
      case 'less':
        return <File size={16} className="text-blue-500" />;
      case 'html':
        return <File size={16} className="text-orange-500" />;
      case 'json':
        return <File size={16} className="text-green-500" />;
      default:
        return <File size={16} className="text-gray-500" />;
    }
  };

  return (
    <div>
      <div
        className={`flex items-center space-x-1 py-1 px-2 hover:bg-[#2A2A2A] cursor-pointer rounded transition-colors duration-150 ${
          level > 0 ? 'ml-4' : ''
        }`}
        onClick={handleClick}
      >
        {node.type === 'directory' && (
          <span className="text-gray-400">
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
        <span className={node.type === 'directory' ? 'text-[#8B5CF6]' : ''}>
          {getFileIcon()}
        </span>
        <span className="text-sm select-none">{node.name}</span>
      </div>
      {node.type === 'directory' && isExpanded && node.children && (
        <div className="ml-2">
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              onFileClick={onFileClick}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileTree: React.FC<FileTreeProps> = ({ tree, onFileClick }) => {
  if (!tree || tree.length === 0) {
    return (
      <div className="text-gray-400 text-sm p-4">
        No files found. Create a new file to get started.
      </div>
    );
  }

  return (
    <div className="font-mono">
      {tree.map((node) => (
        <FileTreeNode key={node.path} node={node} onFileClick={onFileClick} />
      ))}
    </div>
  );
}; 