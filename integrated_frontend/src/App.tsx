import React, { useState } from 'react';
import HomePage from './components/HomePage';
import StudySession from './components/StudySession';
import DocumentsPage from './components/DocumentsPage';
import Navigation from './components/Navigation';

type Page = 'home' | 'study' | 'documents';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  return (
    <div className="min-h-screen">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      
      <main className="pt-16">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'documents' && <DocumentsPage />}
        {currentPage === 'study' && <StudySession />}
      </main>
    </div>
  );
};

export default App;