import React, { useRef } from 'react';
import { Folder, Upload, FileText, Image, Video, Music } from 'lucide-react';
import { useFiles } from '../contexts/FileContext';

const HomePage: React.FC = () => {
  const { inputFiles, addFiles, removeFile } = useFiles();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    { title: 'Documents', icon: FileText, count: inputFiles.filter(f => f.name.match(/\.(pdf|doc|docx|txt)$/i)).length, color: 'blue' },
    { title: 'Images', icon: Image, count: inputFiles.filter(f => f.name.match(/\.(jpg|jpeg|png|gif|bmp)$/i)).length, color: 'emerald' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Your Study Portal
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Upload your study materials and organize them efficiently. Access review sessions and quizzes to enhance your learning experience.
        </p>
      </div>

      {/* Upload Section */}
      <div className="mb-12">
        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-all duration-300 cursor-pointer bg-white/50 backdrop-blur-sm"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleUploadClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          <Upload className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">Upload Your Files</h3>
          <p className="text-gray-600 mb-6">Drag and drop files here or click to browse</p>
          <button
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
            onClick={handleUploadClick}
          >
            Choose Files
          </button>
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
              className={`${colorClasses} p-6 rounded-xl transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg`}
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
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            InputFiles ({inputFiles.length} files)
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
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200 px-3 py-1 rounded-lg hover:bg-red-50"
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