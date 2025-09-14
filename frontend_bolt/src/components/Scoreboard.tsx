import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Clock, User, TrendingUp, Filter, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserScore {
  id: number;
  username: string;
  score: number;
  totalQuestions: number;
  timeElapsed: number;
  completedAt: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  subject: string;
  quizId: string;
}

const Scoreboard: React.FC = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState<UserScore[]>([]);
  const [filteredScores, setFilteredScores] = useState<UserScore[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'score' | 'time' | 'recent'>('score');
  const [currentQuizId] = useState('quiz-1'); // This would come from the current quiz context

  // Sample data - in a real app, this would come from an API
  useEffect(() => {
    const sampleScores: UserScore[] = [
      {
        id: 1,
        username: 'AlexStudy',
        score: 95,
        totalQuestions: 20,
        timeElapsed: 180,
        completedAt: '2024-01-15T10:30:00Z',
        difficulty: 'Hard',
        subject: 'Computer Science',
        quizId: 'quiz-1'
      },
      {
        id: 2,
        username: 'SarahLearns',
        score: 92,
        totalQuestions: 20,
        timeElapsed: 165,
        completedAt: '2024-01-15T09:45:00Z',
        difficulty: 'Hard',
        subject: 'Mathematics',
        quizId: 'quiz-1'
      },
      {
        id: 3,
        username: 'MikeQuiz',
        score: 88,
        totalQuestions: 15,
        timeElapsed: 120,
        completedAt: '2024-01-14T16:20:00Z',
        difficulty: 'Medium',
        subject: 'Physics',
        quizId: 'quiz-1'
      },
      {
        id: 4,
        username: 'EmilyAce',
        score: 85,
        totalQuestions: 18,
        timeElapsed: 200,
        completedAt: '2024-01-14T14:15:00Z',
        difficulty: 'Medium',
        subject: 'Chemistry',
        quizId: 'quiz-2'
      },
      {
        id: 5,
        username: 'JohnMaster',
        score: 82,
        totalQuestions: 12,
        timeElapsed: 95,
        completedAt: '2024-01-13T11:30:00Z',
        difficulty: 'Easy',
        subject: 'Biology',
        quizId: 'quiz-2'
      },
      {
        id: 6,
        username: 'LisaSmart',
        score: 78,
        totalQuestions: 16,
        timeElapsed: 145,
        completedAt: '2024-01-13T08:45:00Z',
        difficulty: 'Medium',
        subject: 'History',
        quizId: 'quiz-1'
      },
      {
        id: 7,
        username: 'DavidPro',
        score: 75,
        totalQuestions: 10,
        timeElapsed: 85,
        completedAt: '2024-01-12T15:20:00Z',
        difficulty: 'Easy',
        subject: 'Literature',
        quizId: 'quiz-2'
      },
      {
        id: 8,
        username: 'RachelTop',
        score: 72,
        totalQuestions: 14,
        timeElapsed: 110,
        completedAt: '2024-01-12T13:10:00Z',
        difficulty: 'Easy',
        subject: 'Geography',
        quizId: 'quiz-1'
      }
    ];
    
    // Filter to only show scores from the same quiz
    const sameQuizScores = sampleScores.filter(score => score.quizId === currentQuizId);
    setScores(sameQuizScores);
    setFilteredScores(sameQuizScores);
  }, []);

  // Filter and sort scores
  useEffect(() => {
    let filtered = scores.filter(score => {
      const matchesSearch = score.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           score.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = filterDifficulty === 'All' || score.difficulty === filterDifficulty;
      return matchesSearch && matchesDifficulty;
    });

    // Sort scores
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return b.score - a.score;
        case 'time':
          return a.timeElapsed - b.timeElapsed;
        case 'recent':
          return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
        default:
          return 0;
      }
    });

    setFilteredScores(filtered);
  }, [scores, searchTerm, filterDifficulty, sortBy]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 1:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">#{index + 1}</div>;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const averageScore = filteredScores.length > 0 
    ? Math.round(filteredScores.reduce((sum, score) => sum + score.score, 0) / filteredScores.length)
    : 0;

  const averageTime = filteredScores.length > 0
    ? Math.round(filteredScores.reduce((sum, score) => sum + score.timeElapsed, 0) / filteredScores.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Leaderboard</h1>
        <div className="max-w-2xl mx-auto">
          <p className="text-xl text-gray-600 mb-2">
            See how you stack up against other learners who took the same quiz.
          </p>
          <p className="text-sm text-gray-500">
            Showing results for Quiz: {currentQuizId.toUpperCase()}
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">{filteredScores.length}</div>
          <div className="text-gray-600">Total Players</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">{averageScore}%</div>
          <div className="text-gray-600">Average Score</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <Clock className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">{formatTime(averageTime)}</div>
          <div className="text-gray-600">Average Time</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <Medal className="w-8 h-8 text-purple-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">
            {filteredScores.filter(s => s.score >= 90).length}
          </div>
          <div className="text-gray-600">Top Performers</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users or subjects..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
              >
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'score' | 'time' | 'recent')}
            >
              <option value="score">Sort by Score</option>
              <option value="time">Sort by Time</option>
              <option value="recent">Sort by Recent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Rankings</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredScores.map((userScore, index) => (
            <div
              key={userScore.id}
              className={`p-6 hover:bg-gray-50 transition-colors duration-200 ${
                index < 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getRankIcon(index)}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{userScore.username}</h3>
                      <p className="text-sm text-gray-500">{userScore.subject}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(userScore.score)}`}>
                      {userScore.score}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {userScore.score}/{userScore.totalQuestions * 5} pts
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">
                      {formatTime(userScore.timeElapsed)}
                    </div>
                    <div className="text-xs text-gray-500">completion time</div>
                  </div>
                  
                  <div className="text-center">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(userScore.difficulty)}`}>
                      {userScore.difficulty}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatDate(userScore.completedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredScores.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Achievement Badges */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">Perfect Score</div>
            <div className="text-xs text-gray-600">AlexStudy</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">Speed Demon</div>
            <div className="text-xs text-gray-600">DavidPro</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">Consistent</div>
            <div className="text-xs text-gray-600">SarahLearns</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Medal className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">Top 3</div>
            <div className="text-xs text-gray-600">MikeQuiz</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;