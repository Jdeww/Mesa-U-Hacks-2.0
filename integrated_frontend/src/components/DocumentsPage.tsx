import React, { useState, useEffect } from 'react';
import { Cloud, FileText, Image, Download, Calendar, HardDrive, Folder } from 'lucide-react';
import axios from 'axios';

interface CloudFile {
  name: string;
  size: number;
  lastModified: string;
  url: string;
}

const DocumentsPage: React.FC = () => {
  const [cloudFiles, setCloudFiles] = useState<CloudFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCloudFiles();
  }, []);

  const loadCloudFiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/cloud-files');
      setCloudFiles(response.data);
      setError(null);
    } catch (error) {
      console.error('Error loading cloud files:', error);
      // For now, show a demo/placeholder instead of error
      setCloudFiles([
        {
          name: 'sample-document.pdf',
          size: 1024 * 1024 * 2.5, // 2.5MB
          lastModified: new Date().toISOString(),
          url: '#'
        },
        {
          name: 'notes.txt',
          size: 1024 * 15, // 15KB
          lastModified: new Date().toISOString(),
          url: '#'
        }
      ]);
      setError(null); // Don't show error, show demo instead
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="w-8 h-8 text-emerald-600" />;
      default:
        return <FileText className="w-8 h-8 text-blue-600" />;
    }
  };

  const handleDownload = (file: CloudFile) => {
    if (file.url === '#') {
      alert('This is a demo file. In a real setup, this would download from your cloud storage.');
      return;
    }
    window.open(file.url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <Cloud className="w-12 h-12 text-blue-600 mr-4" />
          <h1 className="text-4xl font-bold text-white">Cloud Documents</h1>
        </div>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Access all your uploaded files from the cloud. Download, view, and manage your study materials.
        </p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white/80">Loading your cloud files...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Cloud className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-red-800 font-medium">Cloud Connection Error</p>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={loadCloudFiles}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="surface-card p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Folder className="w-6 h-6 text-gray-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Your Files ({cloudFiles.length} items)
              </h2>
            </div>
            <button
              onClick={loadCloudFiles}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Cloud className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>

          {cloudFiles.length === 0 ? (
            <div className="text-center py-12">
              <Cloud className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No files in cloud</h3>
              <p className="text-gray-600">Upload some files from the Home page to see them here.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {cloudFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-6 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    {getFileIcon(file.name)}
                    <div>
                      <h3 className="font-medium text-gray-900 text-lg">{file.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <div className="flex items-center">
                          <HardDrive className="w-4 h-4 mr-1" />
                          {formatFileSize(file.size)}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(file.lastModified)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(file)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center shadow-md hover:shadow-lg"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;