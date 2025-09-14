import React, { useEffect, useRef, useState } from "react";
import { Clock, Play, CheckCircle, XCircle, ArrowRight, Trophy } from "lucide-react";
import type { MCQ } from "../types";

interface QuizProps {
  items: MCQ[];
  onFinish?: (result: { correct: number; total: number; elapsedSeconds: number }) => void;
}

const Quiz: React.FC<QuizProps> = ({ items, onFinish }) => {
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Timer logic
  useEffect(() => {
    if (!started) return;
    if (timerRef.current === null) {
      timerRef.current = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    }
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [started]);

  const stopTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No quiz questions available</p>
      </div>
    );
  }

  const currentQuestion = items[currentIndex];
  const isLastQuestion = currentIndex === items.length - 1;

  const selectAnswer = (index: number) => {
    if (showAnswer) return;
    setSelectedAnswer(index);
  };

  const revealAnswer = () => {
    if (selectedAnswer === null) return;
    setShowAnswer(true);
    if (selectedAnswer === currentQuestion.answer) {
      setCorrectCount(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (!showAnswer) return;
    
    if (isLastQuestion) {
      stopTimer();
      onFinish?.({ 
        correct: correctCount, 
        total: items.length, 
        elapsedSeconds: elapsed 
      });
      return;
    }
    
    setCurrentIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setCorrectCount(0);
    setElapsed(0);
    setStarted(false);
    stopTimer();
  };

  // Format timer display
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeDisplay = elapsed >= 3600 
    ? "Over 1 hour - take a break!" 
    : `${minutes}:${String(seconds).padStart(2, "0")}`;

  // Start screen
  if (!started) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-8 shadow-xl">
          <div className="mb-6">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-2xl font-bold mb-2">Ready to Test Your Knowledge?</h3>
            <p className="text-purple-100">
              You'll answer {items.length} questions with a running timer. 
              Take your time and think carefully!
            </p>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4 mb-6 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold">Questions</div>
                <div className="text-purple-200">{items.length} total</div>
              </div>
              <div>
                <div className="font-semibold">Timer</div>
                <div className="text-purple-200">Tracked automatically</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all duration-200 shadow-lg hover:shadow-xl btn-pop"
          >
            <Play className="w-5 h-5 inline mr-2" />
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // Quiz interface
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with progress and timer */}
      <div className="mb-8 p-4 bg-white/90 backdrop-blur-md rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-lg font-semibold text-gray-900">
              Question {currentIndex + 1} of {items.length}
            </div>
            <div className="flex items-center text-blue-600">
              <Clock className="w-5 h-5 mr-1" />
              <span className="font-mono">{timeDisplay}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Score: <span className="font-semibold text-green-600">{correctCount}</span> / {items.length}
            </div>
            <button
              onClick={resetQuiz}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-xl p-8 mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
            {currentQuestion.q}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="space-y-3 mb-8">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = showAnswer && index === currentQuestion.answer;
            const isWrong = showAnswer && isSelected && index !== currentQuestion.answer;
            
            let buttonClasses = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ";
            
            if (isCorrect) {
              buttonClasses += "bg-green-100 border-green-500 text-green-800";
            } else if (isWrong) {
              buttonClasses += "bg-red-100 border-red-500 text-red-800";
            } else if (isSelected) {
              buttonClasses += "bg-blue-100 border-blue-500 text-blue-800";
            } else {
              buttonClasses += "bg-gray-50 border-gray-200 text-gray-800 hover:bg-gray-100 hover:border-gray-300";
            }

            if (!showAnswer) {
              buttonClasses += " cursor-pointer btn-pop";
            }

            return (
              <button
                key={index}
                onClick={() => selectAnswer(index)}
                disabled={showAnswer}
                className={buttonClasses}
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 shadow-sm">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {isCorrect && <CheckCircle className="w-5 h-5 text-green-600 ml-2" />}
                  {isWrong && <XCircle className="w-5 h-5 text-red-600 ml-2" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={revealAnswer}
            disabled={selectedAnswer === null || showAnswer}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 btn-pop"
          >
            Reveal Answer
          </button>
          
          <button
            onClick={nextQuestion}
            disabled={!showAnswer}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 btn-pop"
          >
            {isLastQuestion ? (
              <>
                Finish Quiz
                <Trophy className="w-5 h-5 inline ml-2" />
              </>
            ) : (
              <>
                Next Question
                <ArrowRight className="w-5 h-5 inline ml-2" />
              </>
            )}
          </button>
        </div>

        {/* Explanation */}
        {showAnswer && currentQuestion.explanation && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                i
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Explanation</h4>
                <p className="text-blue-800 text-sm leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;