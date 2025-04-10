import React, { useEffect, useState } from "react";
import { FileTree } from "@/components/FileTree";
import { SandpackEditor } from "@/components/SandpackEditor";
import { readDirectory, FileNode } from "@/utils/readFileTree";
import * as BrowserFS from "browserfs";

export const CodeEditor = () => {
  const [tree, setTree] = useState<FileNode[]>([]);
  const [fs, setFs] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<{ [key: string]: { code: string } }>({});

  useEffect(() => {
    // Initialize BrowserFS with InMemory filesystem
    BrowserFS.configure({ 
      fs: "InMemory",
      options: {}
    }, function(err) {
      if (err) {
        console.error("Failed to initialize filesystem:", err);
        return;
      }

      const fs = BrowserFS.BFSRequire("fs");
      setFs(fs);

      try {
        // Create base directories
        const directories = ["/src", "/public", "/src/components", "/src/styles"];
        directories.forEach(dir => {
          try {
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir);
            }
          } catch (error) {
            console.error(`Error creating directory ${dir}:`, error);
          }
        });

        // Define initial files with content
        const initialFiles = {
          "/src/App.tsx": `import React, { useState } from 'react';
import { PlusCircle, Trash2, CheckCircle, Circle } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo.trim(), completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-[#8B5CF6] mb-8">Todo App</h1>
        
        <form onSubmit={addTodo} className="flex gap-2 mb-8">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-2 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg focus:outline-none focus:border-[#8B5CF6]"
          />
          <button
            type="submit"
            className="p-2 bg-[#8B5CF6] rounded-lg hover:bg-[#7C3AED] transition-colors"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </form>

        <div className="space-y-4">
          {todos.map(todo => (
            <div
              key={todo.id}
              className="flex items-center gap-4 p-4 bg-[#2A2A2A] rounded-lg group"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className="text-[#8B5CF6] hover:text-[#7C3AED]"
              >
                {todo.completed ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>
              <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="ml-auto text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;`,
          "/src/index.tsx": `import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/main.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);`,
          "/src/styles/main.css": `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #1A1A1A;
  color: white;
}`,
          "/public/index.html": `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Todo App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
        };

        // Create files and update Sandpack files object
        const sandpackFiles: { [key: string]: { code: string } } = {};
        Object.entries(initialFiles).forEach(([path, content]) => {
          try {
            const dir = path.substring(0, path.lastIndexOf("/"));
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir);
            }
            fs.writeFileSync(path, content);
            sandpackFiles[path] = { code: content };
          } catch (error) {
            console.error(`Error creating file ${path}:`, error);
          }
        });

        // Set initial files for Sandpack
        setFiles(sandpackFiles);
        setSelectedFile("/src/App.tsx");

        // Read and set the file tree
        const fileTree = readDirectory(fs, "/");
        setTree(fileTree);
      } catch (error) {
        console.error("Error setting up file system:", error);
      } finally {
        setIsLoading(false);
      }
    });
  }, []);

  const handleFileClick = (path: string) => {
    setSelectedFile(path);
    if (fs) {
      try {
        const content = fs.readFileSync(path, "utf-8");
        setFiles(prev => ({
          ...prev,
          [path]: { code: content }
        }));
      } catch (error) {
        console.error(`Error reading file ${path}:`, error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-[#0D0D0D] text-white">
      {/* File Explorer */}
      <div className="w-1/4 bg-[#1A1A1A] p-4 border-r border-[#2A2A2A] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-[#8B5CF6]">📁 File Explorer</h2>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B5CF6]"></div>
          </div>
        ) : tree.length > 0 ? (
          <FileTree tree={tree} onFileClick={handleFileClick} />
        ) : (
          <div className="text-gray-400 text-sm">No files found. Create a new file to get started.</div>
        )}
      </div>

      {/* Editor */}
      <div className="flex-1 p-4">
        <SandpackEditor
          theme="dark"
          showTabs={true}
          showPreview={true}
          editorHeight="calc(100vh - 2rem)"
          files={files}
          activeFile={selectedFile || "/src/App.tsx"}
        />
      </div>
    </div>
  );
}; 