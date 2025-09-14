import React from 'react';
import { Home, BookOpen, Folder } from 'lucide-react';

interface NavigationProps {
  currentPage: 'home' | 'study' | 'documents';
  setCurrentPage: (page: 'home' | 'study' | 'documents') => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, setCurrentPage }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Nimbus Notes
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentPage('home')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === 'home'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </button>
            
            <button
              onClick={() => setCurrentPage('documents')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === 'documents'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <Folder className="w-4 h-4 mr-2" />
              Documents
            </button>

            <button
              onClick={() => setCurrentPage('study')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === 'study'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Study Session
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;