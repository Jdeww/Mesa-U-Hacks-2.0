import React, { useState, useEffect } from "react";
import FlashcardViewer from "./FlashcardViewer";
import Quiz from "./Quiz";
import Scoreboard from "./Scoreboard";
import axios from "axios";
import type { ContentBundle } from "../types";
import { BookOpen, Brain, Clock } from "lucide-react";

interface StudySessionProps {
  onNavigateToScoreboard?: () => void;
}

const StudySession: React.FC<StudySessionProps> = ({ onNavigateToScoreboard }) => {
  const [bundle, setBundle] = useState<ContentBundle | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [quizResult, setQuizResult] = useState<{ correct: number; total: number; elapsedSeconds: number } | null>(null);
  const [currentMode, setCurrentMode] = useState<'review' | 'quiz'>('review');
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [userName, setUserName] = useState<string>('');

  // Demo data for testing
  const demoBundle: ContentBundle = {
    jobId: "demo-123",
    status: "ready",
    summary: "This comprehensive study guide covers binary search algorithms, data structures comparison (stacks vs queues), and merge operation complexity analysis. Binary search is a fundamental algorithm that efficiently locates elements in sorted arrays by repeatedly dividing the search space in half, achieving optimal logarithmic time complexity.",
    flashcards: [
      { front: "What is the Big-O time complexity of binary search?", back: "O(log n) - Binary search eliminates half of the remaining elements with each comparison, leading to logarithmic time complexity." },
      { front: "What's the key difference between Stack and Queue data structures?", back: "Stack follows LIFO (Last In, First Out) principle, while Queue follows FIFO (First In, First Out) principle." },
      { front: "What's the time complexity of merging two sorted arrays?", back: "O(m + n) where m and n are the sizes of the arrays - we need to examine each element exactly once." },
      { front: "When should you use binary search?", back: "When you have a sorted array/list and need to find a specific element efficiently. It's much faster than linear search for large datasets." },
    ],
    mcqs: [
      {
        q: "What is the time complexity of binary search on a sorted array?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
        answer: 1,
        explanation: "Binary search halves the search space with each comparison, resulting in O(log n) time complexity.",
      },
      {
        q: "Merging two sorted arrays of sizes m and n takes how much time?",
        options: ["O(m + n)", "O(log(m + n))", "O(m × n)", "O(1)"],
        answer: 0,
        explanation: "You need to scan through both arrays once to merge them, resulting in O(m + n) time complexity.",
      },
      {
        q: "What removal policy does a Stack data structure follow?",
        options: ["FIFO (First In, First Out)", "LIFO (Last In, First Out)", "Random access", "Priority-based"],
        answer: 1,
        explanation: "Stacks follow LIFO principle - the last element added is the first one to be removed.",
      },
      {
        q: "Which data structure would be best for implementing a breadth-first search?",
        options: ["Stack", "Queue", "Array", "Linked List"],
        answer: 1,
        explanation: "BFS uses FIFO ordering to explore nodes level by level, making Queue the ideal choice.",
      },
    ],
  };

  useEffect(() => {
    // Load demo content by default
    setBundle(demoBundle);
  }, []);

  const loadStudyContent = async () => {
    setErr(null);
    setLoading(true);
    setQuizResult(null);
    
    try {
      // Try to load real study content from OutputFiles
      const response = await axios.get('/api/study-content');
      setBundle(response.data);
    } catch (error) {
      // Fall back to demo content if no real content available
      console.log('Using demo content');
      setBundle(demoBundle);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (mode: 'review' | 'quiz') => {
    setCurrentMode(mode);
    setQuizResult(null);
    setShowScoreboard(false);
  };

  const handleCompleteReview = () => {
    // Show name input dialog and start quiz
    const name = prompt('Enter your name for the leaderboard:');
    if (name && name.trim()) {
      setUserName(name.trim());
      setCurrentMode('quiz');
    }
  };

  const handleQuizFinish = async (result: { correct: number; total: number; elapsedSeconds: number }) => {
    setQuizResult(result);

    if (userName) {
      try {
        // Calculate points and save score
        const points = Math.max(0, Math.round((result.correct / result.total) * 1000 + (result.total * 100) - (result.elapsedSeconds * 2)));

        await axios.post('http://localhost:3001/api/save-score', {
          name: userName,
          score: result.correct,
          total: result.total,
          elapsedSeconds: result.elapsedSeconds
        });

        // Set completion flag and navigate to scoreboard after a brief delay
        localStorage.setItem('lastQuizCompletion', Date.now().toString());
        setTimeout(() => {
          onNavigateToScoreboard?.();
        }, 2000);
      } catch (error) {
        console.error('Error saving score:', error);
        // Still navigate to scoreboard even if save fails
        localStorage.setItem('lastQuizCompletion', Date.now().toString());
        setTimeout(() => {
          onNavigateToScoreboard?.();
        }, 2000);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Study Session</h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Review your materials with flashcards and test your knowledge with interactive quizzes.
        </p>
      </div>

      {/* Mode Selection */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/90 backdrop-blur-md rounded-xl p-2 shadow-lg">
          <button
            onClick={() => switchMode('review')}
            className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 ${
              currentMode === 'review'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
            }`}
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Review Mode
          </button>
          <button
            onClick={() => switchMode('quiz')}
            className={`flex items-center px-6 py-3 rounded-lg transition-all duration-200 ml-2 ${
              currentMode === 'quiz'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            <Brain className="w-5 h-5 mr-2" />
            Quiz Mode
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading study content...</p>
        </div>
      )}

      {/* Error State */}
      {err && (
        <div className="surface-card p-6 mb-8">
          <div className="text-red-600 text-center">
            <p className="font-semibold">Error loading content</p>
            <p className="text-sm mt-1">{err}</p>
            <button 
              onClick={loadStudyContent}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors btn-pop"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Study Content */}
      {bundle && !loading && (
        <div className="space-y-8">
          {/* Summary Section */}
          <div className="surface-card p-8">
            <div className="flex items-center mb-6">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Study Summary</h2>
            </div>
            <div className="prose prose-lg text-gray-700 max-w-none">
              {bundle.summary}
            </div>
          </div>

          {/* Review Mode - Flashcards */}
          {currentMode === 'review' && (
            <div className="surface-card p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <BookOpen className="w-8 h-8 text-green-600 mr-3" />
                  <h2 className="text-2xl font-semibold text-gray-900">Flashcard Review</h2>
                </div>
                <div className="text-sm text-gray-500">
                  {bundle.flashcards.length} cards
                </div>
              </div>
              <FlashcardViewer
                items={bundle.flashcards}
                onComplete={handleCompleteReview}
              />
            </div>
          )}

          {/* Quiz Mode */}
          {currentMode === 'quiz' && (
            <div id="quiz-section" className="surface-card p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Brain className="w-8 h-8 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-semibold text-gray-900">Knowledge Quiz</h2>
                </div>
                <div className="text-sm text-gray-500">
                  {bundle.mcqs.length} questions
                </div>
              </div>
              
              <Quiz
                items={bundle.mcqs}
                onFinish={handleQuizFinish}
              />

              {quizResult && (
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <Clock className="w-8 h-8 text-blue-600 mr-2" />
                      <h3 className="text-xl font-semibold text-gray-900">Quiz Complete!</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-blue-600">
                        Score: {quizResult.correct}/{quizResult.total}
                      </p>
                      <p className="text-gray-600">
                        {Math.round((quizResult.correct / quizResult.total) * 100)}% correct
                      </p>
                      <p className="text-sm text-gray-500">
                        Time elapsed: {Math.floor(quizResult.elapsedSeconds / 60)}:
                        {String(quizResult.elapsedSeconds % 60).padStart(2, '0')}
                      </p>
                    </div>
                    <button
                      onClick={() => setQuizResult(null)}
                      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors btn-pop"
                    >
                      Take Quiz Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Scoreboard Modal */}
      {showScoreboard && quizResult && (
        <Scoreboard
          userScore={{
            name: userName,
            correct: quizResult.correct,
            total: quizResult.total,
            elapsedSeconds: quizResult.elapsedSeconds,
            points: Math.max(0, Math.round((quizResult.correct / quizResult.total) * 1000 + (quizResult.total * 100) - (quizResult.elapsedSeconds * 2)))
          }}
          onClose={() => setShowScoreboard(false)}
        />
      )}
    </div>
  );
};

export default StudySession;