import React from "react";
import { CodeBlock } from "@/components/CodeBlock";

interface CodeMessageContentProps {
  message: string;
  codeBlocks?: { language: string; code: string; }[];
}

export const CodeMessageContent = ({ message, codeBlocks }: CodeMessageContentProps) => {
  // Extract code from message if it exists
  const parseCodeBlock = (message: string) => {
    const codeMatch = message.match(/```(\w*)\n([\s\S]*?)```/);
    if (!codeMatch) return null;
    
    return {
      language: codeMatch[1] || 'typescript',
      code: codeMatch[2].trim()
    };
  };

  // Handle messages with multiple code blocks and text
  const renderComplexMessage = (message: string) => {
    const parts = [];
    let lastIndex = 0;
    let partIndex = 0;
    
    // Find all code blocks
    const regex = /```(\w*)\n([\s\S]*?)```/g;
    let match;
    
    while ((match = regex.exec(message)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textPart = message.substring(lastIndex, match.index).trim();
        if (textPart) {
          parts.push(
            <div key={`text-${partIndex}`} className="leading-relaxed mb-3">{textPart}</div>
          );
          partIndex++;
        }
      }
      
      // Add code block
      parts.push(
        <div key={`code-${partIndex}`} className="w-full mb-3 -mx-2 sm:mx-0 overflow-hidden">
          <CodeBlock 
            code={match[2].trim()}
            language={match[1] || 'typescript'}
          />
        </div>
      );
      partIndex++;
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text after last code block
    if (lastIndex < message.length) {
      const textPart = message.substring(lastIndex).trim();
      if (textPart) {
        parts.push(
          <div key={`text-${partIndex}`} className="leading-relaxed">{textPart}</div>
        );
      }
    }
    
    return parts;
  };

  // If we have pre-extracted code blocks, use those
  if (codeBlocks && codeBlocks.length > 0) {
    return (
      <div className="w-full space-y-2">
        {codeBlocks.map((block, index) => (
          <div key={index} className="w-full mb-3 -mx-2 sm:mx-0 overflow-hidden">
            <CodeBlock 
              code={block.code}
              language={block.language}
            />
          </div>
        ))}
      </div>
    );
  }

  // Otherwise, parse the message for code blocks
  const codeBlock = parseCodeBlock(message);

  if (codeBlock && !message.includes('```', message.indexOf('```') + 3)) {
    return (
      <div className="w-full space-y-2">
        <CodeBlock 
          code={codeBlock.code}
          language={codeBlock.language}
        />
      </div>
    );
  } else {
    return (
      <div className="w-full space-y-2">
        {renderComplexMessage(message)}
      </div>
    );
  }
};
