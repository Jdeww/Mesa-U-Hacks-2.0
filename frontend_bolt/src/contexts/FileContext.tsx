import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FileContextType {
  inputFiles: File[];
  setInputFiles: (files: File[]) => void;
  addFiles: (files: FileList) => void;
  removeFile: (index: number) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFiles = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
};

interface FileProviderProps {
  children: ReactNode;
}

export const FileProvider: React.FC<FileProviderProps> = ({ children }) => {
  const [inputFiles, setInputFiles] = useState<File[]>([]);

  const addFiles = (files: FileList) => {
    const newFiles = Array.from(files);
    setInputFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setInputFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <FileContext.Provider value={{ inputFiles, setInputFiles, addFiles, removeFile }}>
      {children}
    </FileContext.Provider>
  );
};