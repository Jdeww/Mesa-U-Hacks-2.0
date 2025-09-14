import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Clock, User, Crown } from 'lucide-react';
import axios from 'axios';

interface ScoreData {
  name: string;
  points: number;
  avgScore: number;
  lastPlayed: string;
}

interface ScoreboardProps {
  userScore?: {
    name: string;
    correct: number;
    total: number;
    elapsedSeconds: number;
    points: number;
  };
  onClose?: () => void;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ userScore, onClose }) => {
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/user-scores');
      setScores(response.data);

      // If we have a user score, find their rank
      if (userScore) {
        const userRankPosition = response.data.findIndex(
          (score: ScoreData) => score.points <= userScore.points
        );
        setUserRank(userRankPosition === -1 ? response.data.length + 1 : userRankPosition + 1);
      }
    } catch (error) {
      console.error('Error loading scores:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300';
      case 2:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300';
      case 3:
        return 'bg-gradient-to-r from-amber-100 to-amber-200 border-amber-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 mr-3 text-yellow-300" />
              <div>
                <h2 className="text-2xl font-bold">Leaderboard</h2>
                <p className="text-purple-100">See how you rank among friends!</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white text-2xl font-bold"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* User's Score (if provided) */}
        {userScore && (
          <div className="bg-blue-50 border-b border-blue-200 p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-blue-600 mr-2" />
                <h3 className="text-xl font-bold text-blue-900">Your Result</h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-2xl font-bold text-blue-600">{userScore.correct}</div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-2xl font-bold text-purple-600">{userScore.points}</div>
                  <div className="text-sm text-gray-600">Points</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round((userScore.correct / userScore.total) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Accuracy</div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-2xl font-bold text-orange-600">#{userRank || '?'}</div>
                  <div className="text-sm text-gray-600">Rank</div>
                </div>
              </div>

              <p className="text-blue-700">
                Great job, {userScore.name}! You earned <span className="font-bold">{userScore.points} points</span>
                {userRank && userRank <= 3 && (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    🎉 Top 3!
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Scoreboard */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-purple-600" />
            Top Players
          </h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading scores...</p>
            </div>
          ) : scores.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No scores yet. Be the first to play!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scores.map((score, index) => {
                const rank = index + 1;
                const isCurrentUser = userScore && score.name === userScore.name;

                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ${getRankBackground(rank)} ${
                      isCurrentUser ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {getRankIcon(rank)}
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-gray-500 mr-2" />
                        <div>
                          <div className={`font-semibold ${isCurrentUser ? 'text-blue-900' : 'text-gray-900'}`}>
                            {score.name}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                You
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDate(score.lastPlayed)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-purple-600">
                        {score.points.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {score.avgScore.toFixed(1)}/5.0 avg
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center">
          <p className="text-sm text-gray-600">
            Points are calculated based on accuracy, speed, and question difficulty
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="mt-3 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;