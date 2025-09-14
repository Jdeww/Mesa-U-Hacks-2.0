import React, { useState } from 'react';
import { FileCheck, Clock, Award, RotateCcw, ArrowRight } from 'lucide-react';
import { useFiles } from '../contexts/FileContext';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

const Quiz: React.FC = () => {
  const { inputFiles } = useFiles();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Sample quiz questions (in a real app, these would be generated from the uploaded files)
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "Based on your uploaded materials, what is the main concept covered?",
      options: [
        "Data structures and algorithms",
        "Web development fundamentals", 
        "Machine learning basics",
        "Database management"
      ],
      correctAnswer: 1,
      explanation: "This would be dynamically generated based on the content analysis of uploaded files."
    },
    {
      id: 2,
      question: "Which key principle was emphasized in your study materials?",
      options: [
        "Performance optimization",
        "Code maintainability",
        "User experience design",
        "All of the above"
      ],
      correctAnswer: 3,
      explanation: "Comprehensive materials typically cover multiple important principles."
    },
    {
      id: 3,
      question: "What practical application was discussed in your materials?",
      options: [
        "Building responsive websites",
        "Creating mobile applications",
        "Implementing APIs",
        "All mentioned above"
      ],
      correctAnswer: 3,
      explanation: "Modern development involves multiple interconnected applications."
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizStarted(false);
    setTimeElapsed(0);
  };

  const calculateScore = () => {
    let correct = 0;
    quizQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const startQuiz = () => {
    setQuizStarted(true);
    // Start timer
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    // Clear timer when quiz ends
    if (showResults) {
      clearInterval(timer);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const score = calculateScore();
  const percentage = Math.round((score / quizQuestions.length) * 100);

  if (inputFiles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <FileCheck className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Study Materials Available</h3>
          <p className="text-gray-600 mb-8">Upload some files from the homepage to generate quiz questions based on your materials.</p>
          <a
            href="/"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            <span>Go to Homepage</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <FileCheck className="w-16 h-16 text-blue-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Knowledge Quiz</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test your understanding of the uploaded materials with this interactive quiz.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quiz Overview</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">{quizQuestions.length}</div>
              <div className="text-gray-700">Questions</div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-emerald-600 mb-2">{inputFiles.length}</div>
              <div className="text-gray-700">Files Analyzed</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">~5</div>
              <div className="text-gray-700">Minutes</div>
            </div>
          </div>

          <div className="text-left mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions:</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Each question has multiple choice answers</li>
              <li>• You can navigate between questions freely</li>
              <li>• Review your answers before submitting</li>
              <li>• Explanations will be provided after completion</li>
            </ul>
          </div>

          <button
            onClick={startQuiz}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 text-lg shadow-md hover:shadow-lg"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Award className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Quiz Results</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-blue-600 mb-2">{percentage}%</div>
            <div className="text-xl text-gray-600">You scored {score} out of {quizQuestions.length} questions correct</div>
            <div className="text-gray-500 mt-2">Time taken: {formatTime(timeElapsed)}</div>
          </div>

          <div className={`p-4 rounded-lg text-center ${
            percentage >= 80 ? 'bg-green-100 text-green-800' : 
            percentage >= 60 ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {percentage >= 80 ? '🎉 Excellent work!' : 
             percentage >= 60 ? '👍 Good effort!' : 
             '📚 Keep studying!'}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Answers</h2>
          <div className="space-y-6">
            {quizQuestions.map((question, index) => (
              <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="font-medium text-gray-900 mb-3">{index + 1}. {question.question}</h3>
                <div className="space-y-2 mb-3">
                  {question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-2 rounded text-sm ${
                        optionIndex === question.correctAnswer
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : selectedAnswers[index] === optionIndex && optionIndex !== question.correctAnswer
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : 'bg-gray-50 text-gray-700'
                      }`}
                    >
                      {option} {optionIndex === question.correctAnswer && '✓'} 
                      {selectedAnswers[index] === optionIndex && optionIndex !== question.correctAnswer && '✗'}
                    </div>
                  ))}
                </div>
                {question.explanation && (
                  <p className="text-sm text-gray-600 italic">{question.explanation}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={resetQuiz}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 mx-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Take Quiz Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Quiz Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Knowledge Quiz</h1>
            <p className="text-gray-600">Question {currentQuestion + 1} of {quizQuestions.length}</p>
          </div>
          <div className="flex items-center space-x-4 text-gray-600">
            <Clock className="w-5 h-5" />
            <span>{formatTime(timeElapsed)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {quizQuestions[currentQuestion].question}
          </h2>
          
          <div className="space-y-3">
            {quizQuestions[currentQuestion].options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  className="sr-only"
                  onChange={() => handleAnswerSelect(index)}
                  checked={selectedAnswers[currentQuestion] === index}
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedAnswers[currentQuestion] === index && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
                <span className="text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span>Previous</span>
          </button>

          <div className="text-sm text-gray-500">
            {selectedAnswers.filter(answer => answer !== undefined).length} of {quizQuestions.length} answered
          </div>

          <button
            onClick={nextQuestion}
            disabled={selectedAnswers[currentQuestion] === undefined}
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span>{currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;