import React, { useState } from 'react';
import { BookOpen, Clock, CheckCircle, ArrowRight, FileText } from 'lucide-react';
import { useFiles } from '../contexts/FileContext';

const ReviewSession: React.FC = () => {
  const { inputFiles } = useFiles();
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [reviewProgress, setReviewProgress] = useState<number[]>([]);

  const markAsReviewed = (index: number) => {
    if (!reviewProgress.includes(index)) {
      setReviewProgress([...reviewProgress, index]);
    }
  };

  const nextFile = () => {
    if (currentFileIndex < inputFiles.length - 1) {
      setCurrentFileIndex(currentFileIndex + 1);
    }
  };

  const previousFile = () => {
    if (currentFileIndex > 0) {
      setCurrentFileIndex(currentFileIndex - 1);
    }
  };

  const progressPercentage = inputFiles.length > 0 ? (reviewProgress.length / inputFiles.length) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <BookOpen className="w-16 h-16 text-blue-600 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Review Session</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Review your uploaded materials systematically. Track your progress and ensure you've covered all important content.
        </p>
      </div>

      {inputFiles.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Files to Review</h3>
          <p className="text-gray-600 mb-8">Upload some files from the homepage to start your review session.</p>
          <a
            href="/"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            <span>Go to Homepage</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Progress Bar */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">Review Progress</h2>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600">{reviewProgress.length} of {inputFiles.length} completed</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{Math.round(progressPercentage)}% complete</p>
          </div>

          {/* Current File Review */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                File {currentFileIndex + 1} of {inputFiles.length}
              </h3>
              <div className="flex items-center space-x-2">
                {reviewProgress.includes(currentFileIndex) && (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-600 text-sm font-medium">Reviewed</span>
                  </>
                )}
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-lg p-6 mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <h4 className="font-medium text-gray-900">{inputFiles[currentFileIndex]?.name}</h4>
                  <p className="text-sm text-gray-500">
                    {inputFiles[currentFileIndex] && (inputFiles[currentFileIndex].size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 italic">
                  File content would be displayed here for review. This is a placeholder for the actual file viewer component.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={previousFile}
                disabled={currentFileIndex === 0}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <span>Previous</span>
              </button>

              <button
                onClick={() => markAsReviewed(currentFileIndex)}
                disabled={reviewProgress.includes(currentFileIndex)}
                className="flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <CheckCircle className="w-4 h-4" />
                <span>{reviewProgress.includes(currentFileIndex) ? 'Reviewed' : 'Mark as Reviewed'}</span>
              </button>

              <button
                onClick={nextFile}
                disabled={currentFileIndex === inputFiles.length - 1}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <span>Next</span>
              </button>
            </div>
          </div>

          {/* File List */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">All Files</h3>
            <div className="grid gap-3">
              {inputFiles.map((file, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    index === currentFileIndex
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentFileIndex(index)}
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">{file.name}</span>
                  </div>
                  {reviewProgress.includes(index) && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSession;