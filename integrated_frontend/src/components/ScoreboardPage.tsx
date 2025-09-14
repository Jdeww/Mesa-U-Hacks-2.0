import React from 'react';
import { Trophy, Medal, Star, Clock, User, Crown } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface ScoreData {
  name: string;
  points: number;
  avgScore: number;
  lastPlayed: string;
}

const ScoreboardPage: React.FC = () => {
  const [scores, setScores] = useState<ScoreData[]>([]);
  const [loading, setLoading] = useState(true);
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    loadScores();
    // Check if user just completed a quiz (simple check for recent activity)
    const lastActivity = localStorage.getItem('lastQuizCompletion');
    if (lastActivity) {
      const timeSince = Date.now() - parseInt(lastActivity);
      if (timeSince < 10000) { // Within last 10 seconds
        setJustCompleted(true);
        setTimeout(() => setJustCompleted(false), 5000); // Show for 5 seconds
      }
    }
  }, []);

  const loadScores = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/api/user-scores');
      setScores(response.data);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Celebration Banner (shows when user just completed quiz) */}
        {justCompleted && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-2xl p-6 mb-6 animate-pulse">
            <div className="text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
              <p className="text-green-100">Great job! Check your ranking below.</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-2xl p-8 mb-8">
          <div className="flex items-center">
            <Trophy className="w-12 h-12 mr-4 text-yellow-300" />
            <div>
              <h1 className="text-4xl font-bold">Leaderboard</h1>
              <p className="text-purple-100 text-lg mt-2">See how you rank among friends!</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Players</h3>
                <p className="text-3xl font-bold text-blue-600">{scores.length}</p>
              </div>
              <User className="w-12 h-12 text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Top Score</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {scores.length > 0 ? scores[0]?.points?.toLocaleString() : '0'}
                </p>
              </div>
              <Star className="w-12 h-12 text-purple-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Avg Score</h3>
                <p className="text-3xl font-bold text-green-600">
                  {scores.length > 0
                    ? (scores.reduce((acc, score) => acc + score.avgScore, 0) / scores.length).toFixed(1)
                    : '0.0'
                  }
                </p>
              </div>
              <Trophy className="w-12 h-12 text-green-400" />
            </div>
          </div>
        </div>

        {/* Scoreboard */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Trophy className="w-6 h-6 mr-3 text-purple-600" />
            Top Players
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading scores...</p>
            </div>
          ) : scores.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-xl">No scores yet. Be the first to play!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scores.map((score, index) => {
                const rank = index + 1;

                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-lg ${getRankBackground(rank)}`}
                  >
                    <div className="flex items-center space-x-6">
                      {getRankIcon(rank)}
                      <div className="flex items-center">
                        <User className="w-6 h-6 text-gray-500 mr-3" />
                        <div>
                          <div className="font-bold text-lg text-gray-900">
                            {score.name}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Last played {formatDate(score.lastPlayed)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        {score.points.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {score.avgScore.toFixed(1)}/5.0 average
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8 text-center">
          <p className="text-gray-600">
            Points are calculated based on accuracy, speed, and question difficulty.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Complete quizzes to climb the leaderboard!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScoreboardPage;