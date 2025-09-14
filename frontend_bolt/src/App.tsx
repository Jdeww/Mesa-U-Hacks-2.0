import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { FileProvider } from './contexts/FileContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import HomePage from './components/HomePage';
import ReviewSession from './components/ReviewSession';
import Quiz from './components/Quiz';
import Scoreboard from './components/Scoreboard';
import Navigation from './components/Navigation';

function App() {
  return (
    <AuthProvider>
      <FileProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                  <Navigation />
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/review" element={<ReviewSession />} />
                    <Route path="/quiz" element={<Quiz />} />
                    <Route path="/scoreboard" element={<Scoreboard />} />
                  </Routes>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </FileProvider>
    </AuthProvider>
  );
}

export default App;