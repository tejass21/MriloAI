import React from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
} from '@codesandbox/sandpack-react';
import { FileTabs } from './FileTabs';

interface SandpackEditorProps {
  theme?: 'light' | 'dark';
  showTabs?: boolean;
  showPreview?: boolean;
  editorHeight?: string;
  files?: { [key: string]: { code: string } };
  activeFile?: string;
}

const SandpackContent: React.FC<{
  showPreview?: boolean;
  editorHeight?: string;
}> = ({
  showPreview = true,
  editorHeight = '500px',
}) => {
  const { sandpack } = useSandpack();

  return (
    <div className="flex flex-col h-full">
      <FileTabs />
      <div className={`flex ${showPreview ? 'flex-row' : 'flex-col'} flex-1`}>
        <div className={`${showPreview ? 'w-1/2' : 'w-full'}`}>
          <SandpackCodeEditor
            showTabs={false}
            showLineNumbers={true}
            showInlineErrors={true}
            wrapContent={true}
            style={{ height: editorHeight }}
            customStyle={{
              backgroundColor: '#1A1A1A',
              color: '#FFFFFF',
            }}
          />
        </div>
        {showPreview && (
          <div className="w-1/2 border-l border-[#2A2A2A]">
            <SandpackPreview
              showNavigator={true}
              showRefreshButton={true}
              style={{ height: editorHeight }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const SandpackEditor: React.FC<SandpackEditorProps> = ({
  theme = 'dark',
  showTabs = true,
  showPreview = true,
  editorHeight = '500px',
  files = {},
  activeFile,
}) => {
  const customTheme = {
    colors: {
      surface1: '#1A1A1A',
      surface2: '#2A2A2A',
      surface3: '#3A3A3A',
      clickable: '#8B5CF6',
      base: '#FFFFFF',
      disabled: '#4A4A4A',
      hover: '#8B5CF6',
      accent: '#8B5CF6',
      error: '#FF5555',
      errorSurface: '#FF555522',
    },
    syntax: {
      plain: '#FFFFFF',
      comment: { color: '#6272A4', fontStyle: 'italic' },
      keyword: '#FF79C6',
      tag: '#8B5CF6',
      punctuation: '#F8F8F2',
      definition: '#50FA7B',
      property: '#66D9EF',
      static: '#BD93F9',
      string: '#F1FA8C',
    },
    font: {
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: '"Fira Code", "Fira Mono", monospace',
      size: '14px',
      lineHeight: '1.5',
    },
  };

  const defaultFiles = {
    '/App.tsx': {
      code: `import React from "react";

export default function App() {
  return (
    <div style={{ 
      padding: "2rem",
      fontFamily: "system-ui, sans-serif",
      maxWidth: "600px",
      margin: "0 auto"
    }}>
      <h1 style={{ 
        color: "#8B5CF6",
        fontSize: "2rem",
        marginBottom: "1rem"
      }}>
        Welcome to the Code Editor
      </h1>
      
      <p style={{
        color: "#94A3B8",
        lineHeight: 1.6
      }}>
        Start editing this code to see live changes!
      </p>
    </div>
  );
}`,
    },
  };

  const mergedFiles = { ...defaultFiles, ...files };

  return (
    <SandpackProvider
      theme={customTheme}
      template="react-ts"
      files={mergedFiles}
      options={{
        activeFile: activeFile || '/App.tsx',
        visibleFiles: [activeFile || '/App.tsx'],
        recompileMode: "immediate",
        classes: {
          'sp-wrapper': 'rounded-lg overflow-hidden border border-[#2A2A2A]',
          'sp-layout': 'bg-[#1A1A1A]',
          'sp-tab-button': 'text-gray-400 hover:text-white',
          'sp-tab-button--active': 'text-white border-t-2 border-[#8B5CF6]',
          'sp-code-editor': 'bg-[#1A1A1A]',
        },
      }}
    >
      <SandpackLayout>
        <SandpackContent showPreview={showPreview} editorHeight={editorHeight} />
      </SandpackLayout>
    </SandpackProvider>
  );
}; 