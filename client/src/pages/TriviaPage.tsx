import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Clock, CheckCircle, HelpCircle, AlertTriangle, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { useChonkWallet } from '@/hooks/useChonkWallet';
import ChonkTokenLogo from '@/components/ChonkTokenLogo';
import { apiRequest } from '@/lib/queryClient';

// Type-safe API request method wrappers
const fetchAPI = async (url: string) => {
  const response = await fetch(url, { credentials: 'include' });
  return response;
};

const postAPI = async (url: string, data?: any) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include'
  });
  return response;
};
import { TriviaQuiz, TriviaQuestion, TriviaSubmission } from '@shared/schema';

const TriviaPage: React.FC = () => {
  const { account } = useChonkWallet();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuiz, setCurrentQuiz] = useState<TriviaQuiz | null>(null);
  const [userSubmission, setUserSubmission] = useState<TriviaSubmission | null>(null);
  const [quizHistory, setQuizHistory] = useState<{ quiz: TriviaQuiz, submission: TriviaSubmission }[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    const fetchCurrentQuiz = async () => {
      try {
        setIsLoading(true);
        const response = await fetchAPI('/api/trivia/current-quiz');
        const data = await response.json();
        
        if (data.quiz) {
          setCurrentQuiz(data.quiz);
          
          // Check if user has already taken this quiz
          if (account && data.quiz.id) {
            const submissionResponse = await fetchAPI(`/api/trivia/quizzes/${data.quiz.id}/submissions/${account}`);
            const submissionData = await submissionResponse.json();
            
            if (submissionData.submission) {
              setUserSubmission(submissionData.submission);
            }
          }
        }
        
        // Fetch quiz history
        fetchQuizHistory();
      } catch (error) {
        console.error('Error fetching current quiz:', error);
        toast({
          title: 'Error',
          description: 'Failed to load the current trivia quiz.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchQuizHistory = async () => {
      if (!account) return;
      
      try {
        const response = await fetchAPI('/api/trivia/quizzes?limit=5');
        const quizzes = await response.json();
        
        // For each quiz, get the user's submission if any
        const history = await Promise.all(quizzes.data.map(async (quiz: TriviaQuiz) => {
          const submissionResponse = await fetchAPI(`/api/trivia/quizzes/${quiz.id}/submissions/${account}`);
          const submissionData = await submissionResponse.json();
          
          return {
            quiz,
            submission: submissionData.submission || null
          };
        }));
        
        setQuizHistory(history.filter(item => item.submission !== null));
      } catch (error) {
        console.error('Error fetching quiz history:', error);
      }
    };
    
    // Update time remaining
    const updateTimeRemaining = () => {
      if (!currentQuiz) return;
      
      const endDate = new Date(currentQuiz.endDate);
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeRemaining('Ended');
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
    };
    
    fetchCurrentQuiz();
    
    // Update time remaining every minute
    updateTimeRemaining();
    const timer = setInterval(updateTimeRemaining, 60000);
    
    return () => clearInterval(timer);
  }, [account, toast]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleTakeQuiz = () => {
    if (!account) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to participate in the trivia.',
        variant: 'destructive'
      });
      return;
    }
    
    if (!currentQuiz) return;
    
    window.location.href = `/trivia/${currentQuiz.id}`;
  };
  
  const handleClaimReward = async (submissionId: number) => {
    if (!account) return;
    
    try {
      const response = await postAPI(`/api/trivia/submissions/${submissionId}/claim-reward`);
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Reward Claimed!',
          description: `You've claimed ${data.rewardAmount} CHONK9K tokens.`,
        });
        
        // Refresh user submission data
        if (currentQuiz) {
          const submissionResponse = await fetchAPI(`/api/trivia/quizzes/${currentQuiz.id}/submissions/${account}`);
          const submissionData = await submissionResponse.json();
          
          if (submissionData.submission) {
            setUserSubmission(submissionData.submission);
          }
        }
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast({
        title: 'Error',
        description: 'Failed to claim your reward. Please try again.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-2">
          <ChonkTokenLogo size={60} />
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
            Crypto Trivia Challenge
          </h1>
        </div>
        <p className="text-gray-400 mb-8">
          Test your crypto knowledge and earn $CHONK9K rewards by participating in our weekly trivia!
        </p>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#ff00ff]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Quiz */}
            <div className="lg:col-span-2 space-y-6">
              {currentQuiz ? (
                <Card className="bg-black/80 border border-[#ff00ff]/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-bold">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                          {currentQuiz.title}
                        </span>
                      </CardTitle>
                      <Badge className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white">
                        {currentQuiz.difficulty}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-400">
                      {currentQuiz.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="bg-black/50 rounded-lg p-4 border border-gray-800">
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-[#ff00ff]" />
                          <div>
                            <p className="text-xs text-gray-500">Period</p>
                            <p className="text-sm text-white">
                              {formatDate(currentQuiz.startDate)} - {formatDate(currentQuiz.endDate)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-[#00e0ff]" />
                          <div>
                            <p className="text-xs text-gray-500">Time Remaining</p>
                            <p className="text-sm text-white">{timeRemaining}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-[#ff00ff]" />
                          <div>
                            <p className="text-xs text-gray-500">Reward</p>
                            <p className="text-sm text-white flex items-center">
                              <ChonkTokenLogo size={16} className="mr-1" /> {currentQuiz.rewardAmount} CHONK9K
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {userSubmission ? (
                      <div className="bg-black/50 rounded-lg p-4 border border-gray-800">
                        <div className="mb-3">
                          <h3 className="text-md font-medium text-white mb-1">Your Results</h3>
                          <p className="text-sm text-gray-400">
                            You've completed this quiz on {formatDate(userSubmission.submittedAt || '')}
                          </p>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-400">Score</span>
                            <span className="text-sm font-medium text-white">{userSubmission.score}%</span>
                          </div>
                          <Progress
                            value={userSubmission.score}
                            className="h-2 bg-gray-800"
                          />
                        </div>
                        
                        {userSubmission.rewardClaimed ? (
                          <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                            <CheckCircle className="h-3 w-3 mr-1" /> Reward Claimed
                          </Badge>
                        ) : userSubmission.completed ? (
                          <Button
                            onClick={() => handleClaimReward(userSubmission.id)}
                            className="w-full bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white"
                          >
                            Claim {currentQuiz.rewardAmount} CHONK9K
                          </Button>
                        ) : (
                          <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                            <AlertTriangle className="h-3 w-3 mr-1" /> Quiz not completed
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <HelpCircle className="h-12 w-12 mx-auto mb-3 text-[#ff00ff] opacity-80" />
                        <h3 className="text-lg font-medium text-white mb-2">Ready to test your knowledge?</h3>
                        <p className="text-sm text-gray-400 mb-4">
                          Answer all questions correctly to maximize your CHONK9K rewards!
                        </p>
                        <Button
                          onClick={handleTakeQuiz}
                          className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white"
                        >
                          Take Quiz Now
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-black/80 border border-[#ff00ff]/30">
                  <CardContent className="text-center py-12">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-[#ff00ff]/50" />
                    <h3 className="text-xl font-medium text-white mb-2">No Active Trivia</h3>
                    <p className="text-gray-400 mb-6">
                      There's no active trivia challenge at the moment. Check back soon for new opportunities to earn CHONK9K tokens!
                    </p>
                  </CardContent>
                </Card>
              )}
              
              {/* How It Works */}
              <Card className="bg-black/80 border border-[#ff00ff]/30">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                      How It Works
                    </span>
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-black/50 border border-gray-800">
                      <div className="w-10 h-10 rounded-full bg-[#ff00ff]/20 flex items-center justify-center mb-3">
                        <span className="text-[#ff00ff] font-bold">1</span>
                      </div>
                      <h3 className="font-medium text-white mb-2">Take the Quiz</h3>
                      <p className="text-sm text-gray-400">
                        Connect your wallet and answer crypto-related questions in our weekly trivia challenge.
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-black/50 border border-gray-800">
                      <div className="w-10 h-10 rounded-full bg-[#ff00ff]/20 flex items-center justify-center mb-3">
                        <span className="text-[#ff00ff] font-bold">2</span>
                      </div>
                      <h3 className="font-medium text-white mb-2">Score Points</h3>
                      <p className="text-sm text-gray-400">
                        Your score is calculated based on the number of correct answers. Higher scores earn bigger rewards!
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-black/50 border border-gray-800">
                      <div className="w-10 h-10 rounded-full bg-[#ff00ff]/20 flex items-center justify-center mb-3">
                        <span className="text-[#ff00ff] font-bold">3</span>
                      </div>
                      <h3 className="font-medium text-white mb-2">Claim Rewards</h3>
                      <p className="text-sm text-gray-400">
                        Earn CHONK9K tokens based on your performance. Rewards are transferred directly to your wallet.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Quiz History & Leaderboard */}
            <div className="space-y-6">
              {/* Quiz History */}
              <Card className="bg-black/80 border border-[#ff00ff]/30">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                      Your History
                    </span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Your recent trivia challenges
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {account ? (
                    quizHistory.length > 0 ? (
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {quizHistory.map(({ quiz, submission }) => (
                          <div key={quiz.id} className="p-3 rounded-lg bg-black/50 border border-gray-800">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-white">{quiz.title}</h4>
                              <Badge className={submission.rewardClaimed ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                                {submission.rewardClaimed ? 'Claimed' : 'Pending'}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-400 mb-2">
                              {formatDate(submission.submittedAt || '')}
                            </p>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">Score:</span>
                              <span className="text-white">{submission.score}%</span>
                            </div>
                            <Progress
                              value={submission.score}
                              className="h-1 mt-1 bg-gray-800"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-400">
                        <p>You haven't taken any quizzes yet.</p>
                        <p className="text-sm">Participate to earn CHONK9K tokens!</p>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-6 text-gray-400">
                      <p>Connect your wallet to see your quiz history.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Leaderboard */}
              <Card className="bg-black/80 border border-[#ff00ff]/30">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                      Top Trivia Players
                    </span>
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    This week's leaderboard
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-2">
                    {/* Mock leaderboard data */}
                    {[
                      { name: 'CryptoWhiz', score: 98, reward: '1500' },
                      { name: 'BlockchainMaster', score: 95, reward: '1200' },
                      { name: 'TokenGuru', score: 92, reward: '1000' },
                      { name: 'SatoshiFan', score: 88, reward: '800' },
                      { name: 'CoinCollector', score: 85, reward: '600' },
                    ].map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-black/50 border border-gray-800">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] mr-2 flex items-center justify-center text-xs font-bold text-white">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-white">{entry.name}</p>
                            <p className="text-xs text-gray-400">Score: {entry.score}%</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="border-[#00e0ff]/30 text-[#00e0ff] flex items-center">
                          <ChonkTokenLogo size={14} className="mr-1" /> {entry.reward}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Link href="/trivia/leaderboard">
                    <Button variant="outline" className="w-full border-[#ff00ff]/30 text-[#ff00ff] hover:bg-[#ff00ff]/10">
                      View Full Leaderboard <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TriviaPage;
