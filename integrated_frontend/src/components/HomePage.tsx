import React, { useRef, useState, useEffect } from 'react';
import { Folder, Upload, FileText, Image, Video, Music, BookOpen, Brain } from 'lucide-react';
import axios from 'axios';
import type { UploadedFile, StudyMaterial } from '../types';

// Component to format the summary text with proper sections
const FormattedSummary: React.FC<{ text: string }> = ({ text }) => {
  const formatText = (text: string) => {
    const lines = text.split('\n');
    const sections: JSX.Element[] = [];
    let currentSection: JSX.Element[] = [];
    let sectionKey = 0;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('*') && trimmedLine.endsWith('*') && trimmedLine.length > 2) {
        // This is a topic heading - push current section and start new one
        if (currentSection.length > 0) {
          sections.push(
            <div key={sectionKey++} className="mb-8">
              {currentSection}
            </div>
          );
          currentSection = [];
        }

        // Create the heading
        const headingText = trimmedLine.slice(1, -1).trim(); // Remove * from both ends
        currentSection.push(
          <h2 key={`heading-${index}`} className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-200 pb-2">
            {headingText}
          </h2>
        );
      } else if (trimmedLine.startsWith('-')) {
        // This is a bullet point
        const bulletText = trimmedLine.slice(1).trim();
        currentSection.push(
          <div key={`bullet-${index}`} className="flex items-start mb-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
            <p className="text-gray-700 leading-relaxed">{bulletText}</p>
          </div>
        );
      } else if (trimmedLine.length > 0) {
        // Regular paragraph text
        currentSection.push(
          <p key={`para-${index}`} className="text-gray-700 leading-relaxed mb-4 text-lg">
            {trimmedLine}
          </p>
        );
      }
    });

    // Don't forget the last section
    if (currentSection.length > 0) {
      sections.push(
        <div key={sectionKey} className="mb-8">
          {currentSection}
        </div>
      );
    }

    return sections;
  };

  return <div className="space-y-6">{formatText(text)}</div>;
};

const HomePage: React.FC = () => {
  const [inputFiles, setInputFiles] = useState<UploadedFile[]>([]);
  const [studyMaterial, setStudyMaterial] = useState<StudyMaterial | null>(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Load study materials on component mount
  useEffect(() => {
    loadStudyMaterials();
  }, []);

  const loadStudyMaterials = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/study-materials');
      setStudyMaterial(response.data);
    } catch (error) {
      console.log('No study materials found yet');
      setStudyMaterial(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      addFiles(event.target.files);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      addFiles(event.dataTransfer.files);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const addFiles = async (files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    }));
    setInputFiles(prev => [...prev, ...newFiles]);

    // Upload files immediately
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post('http://localhost:3001/api/upload-files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      console.log('Files uploaded:', response.data);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const removeFile = (index: number) => {
    setInputFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (inputFiles.length === 0) return;
    
    setProcessing(true);
    try {
      // Trigger Python processing
      const response = await axios.post('http://localhost:3001/api/process-files');
      console.log('Processing complete:', response.data);
      
      // Reload study materials after processing
      setTimeout(async () => {
        await loadStudyMaterials();
      }, 2000); // Give it a moment to complete
      
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setProcessing(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="w-8 h-8 text-emerald-600" />;
      case 'mp4':
      case 'mov':
      case 'avi':
        return <Video className="w-8 h-8 text-orange-600" />;
      case 'mp3':
      case 'wav':
        return <Music className="w-8 h-8 text-purple-600" />;
      default:
        return <FileText className="w-8 h-8 text-blue-600" />;
    }
  };

  const folderCategories = [
    { 
      title: 'Documents', 
      icon: FileText, 
      count: inputFiles.filter(f => f.name.match(/\.(pdf|doc|docx|txt)$/i)).length, 
      color: 'blue' 
    },
    { 
      title: 'Images', 
      icon: Image, 
      count: inputFiles.filter(f => f.name.match(/\.(jpg|jpeg|png|gif|bmp)$/i)).length, 
      color: 'emerald' 
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to Nimbus Notes
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Upload your study materials, get AI-generated summaries, and comprehensive study guides in the cloud.
        </p>
      </div>

      {/* Study Material Display */}
      {studyMaterial && (
        <div className="mb-12 surface-card p-8">
          <div className="flex items-center mb-6">
            <Brain className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Your Study Materials
            </h2>
            <span className="ml-auto text-sm text-gray-500">
              Updated: {studyMaterial.lastUpdated}
            </span>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-center mb-8">
                <BookOpen className="w-8 h-8 text-blue-600 mr-4" />
                <h3 className="text-3xl font-bold text-gray-900">Study Summary</h3>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl shadow-lg border border-blue-100">
                <div className="prose prose-lg max-w-none">
                  <FormattedSummary text={studyMaterial.summarization} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="mb-12">
        <div
          className="border-2 border-dashed border-white/30 rounded-xl p-12 text-center hover:border-blue-400 transition-all duration-300 surface-card"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <Upload className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Upload Your Study Files</h3>
          <p className="text-gray-600 mb-6">Drag and drop files here or click to browse</p>
          <div className="space-x-4">
            <button
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg btn-pop"
              onClick={(e) => {
                e.stopPropagation();
                handleUploadClick();
              }}
            >
              Choose Files
            </button>
            {inputFiles.length > 0 && (
              <button
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 shadow-md hover:shadow-lg btn-pop disabled:opacity-50"
                onClick={(e) => {
                  e.stopPropagation();
                  processFiles();
                }}
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Generate Study Materials'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Folder Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {folderCategories.map((category) => {
          const Icon = category.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
            emerald: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200',
            orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
            purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
          }[category.color];

          return (
            <div
              key={category.title}
              className={`${colorClasses} p-6 rounded-xl transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg btn-pop`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 rounded-full bg-white/50">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{category.title}</h3>
                <p className="text-sm opacity-80">{category.count} files</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Uploaded Files */}
      {inputFiles.length > 0 && (
        <div className="surface-card p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Uploaded Files ({inputFiles.length} files)
          </h2>
          <div className="grid gap-4 max-h-96 overflow-y-auto">
            {inputFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  {getFileIcon(file.name)}
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200 px-3 py-1 rounded-lg hover:bg-red-50 btn-pop"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;