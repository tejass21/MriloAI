export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

export const readDirectory = (fs: any, path: string): FileNode[] => {
  try {
    const entries = fs.readdirSync(path);
    const nodes: FileNode[] = [];

    for (const entry of entries) {
      try {
        const fullPath = path === '/' ? `/${entry}` : `${path}/${entry}`;
        const stats = fs.statSync(fullPath);
        const isDirectory = stats.isDirectory();

        const node: FileNode = {
          name: entry,
          path: fullPath,
          type: isDirectory ? 'directory' : 'file'
        };

        if (isDirectory) {
          const children = readDirectory(fs, fullPath);
          if (children.length > 0) {
            node.children = children;
          }
        }

        nodes.push(node);
      } catch (error) {
        console.error(`Error processing entry ${entry}:`, error);
      }
    }

    // Sort directories first, then files, both alphabetically
    return nodes.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'directory' ? -1 : 1;
    });
  } catch (err) {
    console.error(`Error reading directory ${path}:`, err);
    return [];
  }
}; 