import { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen, Plus, Trash2 } from 'lucide-react';
import { usePromptStore } from '../../store/promptStore';
import { FileNode } from '../../store/promptStore';
import { cn } from '../../utils/cn';

interface FileExplorerProps {
  files: FileNode[];
  currentFileId: string | undefined;
}

export default function FileExplorer({ files, currentFileId }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    '/src': true, // Default expand src folder
  });
  
  const { setCurrentFile } = usePromptStore();
  
  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleFileClick = (file: FileNode) => {
    if (file.type === 'file') {
      setCurrentFile(file);
    } else {
      toggleFolder(file.path);
    }
  };
  
  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.sort((a, b) => {
      // Folders first, then alphabetically
      if (a.type === 'folder' && b.type === 'file') return -1;
      if (a.type === 'file' && b.type === 'folder') return 1;
      return a.name.localeCompare(b.name);
    }).map(node => {
      const isExpanded = expandedFolders[node.path] || false;
      const isSelected = node.id === currentFileId;
      
      return (
        <div key={node.id} className="select-none">
          <div 
            className={cn(
              "flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-dark-100 cursor-pointer",
              isSelected && "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
            )}
            style={{ paddingLeft: `${(level * 12) + 8}px` }}
            onClick={() => handleFileClick(node)}
          >
            {node.type === 'folder' ? (
              <>
                <span className="w-4 mr-1">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  )}
                </span>
                {isExpanded ? (
                  <FolderOpen className="h-4 w-4 text-blue-500 mr-1.5" />
                ) : (
                  <Folder className="h-4 w-4 text-blue-500 mr-1.5" />
                )}
              </>
            ) : (
              <>
                <span className="w-4 mr-1"></span>
                <FileText className="h-4 w-4 text-gray-400 mr-1.5" />
              </>
            )}
            <span className="text-sm truncate">{node.name}</span>
          </div>
          
          {node.type === 'folder' && isExpanded && node.children && (
            <div>
              {renderFileTree(node.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };
  
  return (
    <div className="w-60 bg-gray-50 dark:bg-dark-300 border-r border-gray-200 dark:border-gray-800 flex flex-col">
      <div className="h-9 px-4 flex items-center justify-between bg-gray-100 dark:bg-dark-200 border-b border-gray-200 dark:border-gray-800">
        <span className="text-sm font-medium">Explorer</span>
        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex-1 overflow-auto">
        {files.length > 0 ? (
          <div className="py-2">
            {renderFileTree(files)}
          </div>
        ) : (
          <div className="p-4 text-sm text-gray-500 dark:text-gray-400 text-center italic">
            No files yet
          </div>
        )}
      </div>
    </div>
  );
}