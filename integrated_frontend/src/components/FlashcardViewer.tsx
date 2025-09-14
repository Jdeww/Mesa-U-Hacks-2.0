import React, { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, CheckCircle } from "lucide-react";
import type { Flashcard } from "../types";

interface FlashcardViewerProps {
  items: Flashcard[];
  onComplete?: () => void;
}

const FlashcardViewer: React.FC<FlashcardViewerProps> = ({ items, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedCards, setCompletedCards] = useState(new Set<number>());

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No flashcards available</p>
      </div>
    );
  }

  const currentCard = items[currentIndex];
  const isLastCard = currentIndex === items.length - 1;
  const isFirstCard = currentIndex === 0;

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (!isLastCard) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else if (onComplete) {
      onComplete();
    }
  };

  const prevCard = () => {
    if (!isFirstCard) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const markAsKnown = () => {
    setCompletedCards(prev => new Set([...prev, currentIndex]));
    nextCard();
  };

  const resetProgress = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCompletedCards(new Set());
  };

  const progressPercentage = (completedCards.size / items.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Card {currentIndex + 1} of {items.length}
          </span>
          <span className="text-sm text-gray-500">
            {completedCards.size} completed ({Math.round(progressPercentage)}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="mb-8">
        <div 
          className="relative h-80 cursor-pointer group"
          onClick={flipCard}
        >
          <div className={`absolute inset-0 w-full h-full transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            {/* Front of card */}
            <div className="absolute inset-0 w-full h-full backface-hidden">
              <div className="h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-xl flex items-center justify-center p-8 text-white group-hover:shadow-2xl transition-shadow duration-300">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">Question</h3>
                  <p className="text-lg leading-relaxed">{currentCard.front}</p>
                  <p className="text-sm mt-6 opacity-75">Click to reveal answer</p>
                </div>
              </div>
            </div>

            {/* Back of card */}
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
              <div className="h-full bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-xl flex items-center justify-center p-8 text-white group-hover:shadow-2xl transition-shadow duration-300">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">Answer</h3>
                  <p className="text-lg leading-relaxed">{currentCard.back}</p>
                  <p className="text-sm mt-6 opacity-75">Click to flip back</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={prevCard}
          disabled={isFirstCard}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 btn-pop"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Previous
        </button>

        {isFlipped && (
          <button
            onClick={markAsKnown}
            className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 btn-pop"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            I Know This
          </button>
        )}

        <button
          onClick={nextCard}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 btn-pop"
        >
          {isLastCard ? 'Complete Review' : 'Next'}
          {!isLastCard && <ChevronRight className="w-5 h-5 ml-1" />}
        </button>

        <button
          onClick={resetProgress}
          className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 btn-pop"
          title="Reset Progress"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Study Tips */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">Study Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click the card to reveal the answer</li>
          <li>• Mark cards as "known" to track your progress</li>
          <li>• Review cards you're unsure about multiple times</li>
          <li>• Take breaks between review sessions for better retention</li>
        </ul>
      </div>

      <style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default FlashcardViewer;