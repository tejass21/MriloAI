import React, { useState } from 'react';
import { Check, Copy, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock = ({ code, language = 'typescript', showLineNumbers = true }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format code for display
  const formattedCode = code.split('\n').map((line, i) => (
    <div key={i} className="relative">
      {showLineNumbers && (
        <span className="absolute left-0 top-0 inline-block w-8 text-right pr-2 select-none text-[#8B5CF6]/50 text-xs">
          {i + 1}
        </span>
      )}
      <span className={showLineNumbers ? "pl-10" : ""}>{line || " "}</span>
    </div>
  ));

  return (
    <div className="relative group rounded-xl border border-[#2A2A2A] shadow-lg bg-[#1A1A1A] text-white overflow-hidden my-2">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 xs:px-4 xs:py-2.5 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#8B5CF6]" />
          <span className="text-xs xs:text-sm font-medium text-[#8B5CF6]">{language}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 xs:h-8 xs:w-8 hover:bg-[#2A2A2A] hover:text-[#8B5CF6]"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 xs:h-4 xs:w-4 text-[#8B5CF6]" />
          ) : (
            <Copy className="h-3.5 w-3.5 xs:h-4 xs:w-4 text-[#8B5CF6]" />
          )}
        </Button>
      </div>

      {/* Code Content */}
      <div className="relative overflow-x-auto">
        <pre className={cn(
          "p-3 xs:p-4 text-xs xs:text-sm font-mono leading-relaxed",
          showLineNumbers && "pl-2"
        )}>
          <code className="text-white">{formattedCode}</code>
        </pre>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/0 via-[#8B5CF6]/5 to-[#8B5CF6]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};
