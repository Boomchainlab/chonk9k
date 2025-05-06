import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useChonkWallet } from '@/hooks/useChonkWallet';
import ChonkTokenLogo from '@/components/ChonkTokenLogo';
import TriviaPopup from '@/components/TriviaPopup';
import TriviaPopupManager from '@/components/TriviaPopupManager';
import { Trophy, Calendar, Clock, BookOpen, Flame, HelpCircle, History, Award, BarChart } from 'lucide-react';

const TriviaPage: React.FC = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [enableRandomTrivia, setEnableRandomTrivia] = useState(false);
  const { account, isConnected } = useChonkWallet();
  const { toast } = useToast();
  
  const handleDemoComplete = (earned: number, correct: boolean) => {
    if (correct && earned > 0) {
      toast({
        title: 'Demo reward earned!',
        description: `You would earn ${earned} CHONK9K tokens in the real game.`,
        variant: 'default',
      });
    }
    setShowDemo(false);
  };
  
  const toggleRandomTrivia = () => {
    const newState = !enableRandomTrivia;
    setEnableRandomTrivia(newState);
    
    toast({
      title: newState ? 'Random Trivia Enabled' : 'Random Trivia Disabled',
      description: newState 
        ? 'Trivia questions will now randomly appear as you browse.' 
        : 'Trivia questions will no longer appear randomly.',
      variant: newState ? 'default' : 'destructive',
    });
  };
  
  // Mock trivia data
  const upcomingTrivia = [
    {
      id: '1',
      title: 'Cryptocurrency Basics',
      date: 'May 7, 2025',
      time: '18:00 UTC',
      reward: '100 CHONK9K',
      questions: 10,
      difficulty: 'Beginner'
    },
    {
      id: '2',
      title: 'DeFi Deep Dive',
      date: 'May 14, 2025',
      time: '19:00 UTC',
      reward: '250 CHONK9K',
      questions: 15,
      difficulty: 'Intermediate'
    },
    {
      id: '3',
      title: 'CHONK9K Tokenomics',
      date: 'May 21, 2025',
      time: '20:00 UTC',
      reward: '500 CHONK9K',
      questions: 12,
      difficulty: 'Advanced'
    }
  ];
  
  const pastTrivia = [
    {
      id: 'p1',
      title: 'Blockchain Fundamentals',
      date: 'April 30, 2025',
      participants: 487,
      avgScore: '72%',
      topPrize: '500 CHONK9K'
    },
    {
      id: 'p2',
      title: 'Meme Token Special',
      date: 'April 23, 2025',
      participants: 612,
      avgScore: '68%',
      topPrize: '350 CHONK9K'
    },
    {
      id: 'p3',
      title: 'Crypto Security',
      date: 'April 16, 2025',
      participants: 529,
      avgScore: '63%',
      topPrize: '400 CHONK9K'
    }
  ];
  
  const myStats = {
    questionsAnswered: 42,
    correctAnswers: 36,
    accuracy: '85.7%',
    tokensEarned: 324,
    rank: '#128',
    level: 'Gold',
    streak: 4
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Random trivia popup manager */}
      {enableRandomTrivia && <TriviaPopupManager probability={25} />}
      
      {/* Show demo popup */}
      {showDemo && (
        <TriviaPopup
          onClose={() => setShowDemo(false)}
          onComplete={handleDemoComplete}
          timeLimit={45}
        />
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Trophy className="h-8 w-8 text-amber-400" />
            CHONK9K Trivia Challenges
          </h1>
          <p className="text-gray-300">
            Test your crypto knowledge and earn CHONK9K rewards with our trivia challenges.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowDemo(true)}
            variant="outline"
            className="bg-pink-900/30 border-pink-500/30 hover:bg-pink-800/30"
          >
            <HelpCircle className="mr-2 h-4 w-4" />
            Try Demo Question
          </Button>
          
          <Button
            onClick={toggleRandomTrivia}
            variant={enableRandomTrivia ? "destructive" : "default"}
            className={enableRandomTrivia ? "bg-amber-600 hover:bg-amber-700" : ""}
          >
            {enableRandomTrivia ? "Disable" : "Enable"} Random Trivia
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="upcoming">
            <Calendar className="mr-2 h-4 w-4" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="leaderboard">
            <Award className="mr-2 h-4 w-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="mystats">
            <BarChart className="mr-2 h-4 w-4" />
            My Stats
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Upcoming trivia cards */}
            {upcomingTrivia.map(quiz => (
              <Card key={quiz.id} className="bg-black/40 border-pink-500/30">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">{quiz.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        <div className="flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1 text-blue-400" />
                          <span>{quiz.date}</span>
                        </div>
                      </CardDescription>
                    </div>
                    <div className="bg-pink-900/50 text-pink-300 px-2 py-1 text-xs rounded">
                      {quiz.difficulty}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{quiz.time}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{quiz.questions} Questions</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-gradient-to-r from-pink-900/30 to-purple-900/30 p-3 rounded-lg border border-pink-500/20">
                    <div className="text-sm text-gray-300 mb-1">Top Reward:</div>
                    <div className="flex items-center">
                      <ChonkTokenLogo size={24} />
                      <span className="ml-2 text-amber-400 font-bold">{quiz.reward}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button className="w-full bg-pink-600 hover:bg-pink-700">
                    <Calendar className="mr-2 h-4 w-4" />
                    Set Reminder
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {/* Feature card that explains how trivia works */}
            <Card className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">How Trivia Works</CardTitle>
                <CardDescription className="text-gray-300">
                  Learn and earn with CHONK9K trivia
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-900 flex items-center justify-center">
                    <HelpCircle className="h-5 w-5 text-blue-300" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-300">Random Pop-ups</h4>
                    <p className="text-sm text-gray-300">Answer trivia questions that appear randomly while browsing the site</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-900 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-green-300" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-green-300">Earn Rewards</h4>
                    <p className="text-sm text-gray-300">Get CHONK9K tokens for each correct answer based on difficulty</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-amber-900 flex items-center justify-center">
                    <Flame className="h-5 w-5 text-amber-300" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-amber-300">Weekly Competitions</h4>
                    <p className="text-sm text-gray-300">Join scheduled trivia events with bigger prizes and leaderboards</p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full border-blue-500/30 hover:bg-blue-900/30"
                  onClick={toggleRandomTrivia}
                >
                  {enableRandomTrivia ? "Disable" : "Enable"} Random Trivia
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <History className="h-6 w-6 text-blue-400" />
              Past Trivia Events
            </h2>
            
            <div className="overflow-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-800/50 text-left">
                    <th className="p-4 text-gray-300 font-medium">Trivia Event</th>
                    <th className="p-4 text-gray-300 font-medium">Date</th>
                    <th className="p-4 text-gray-300 font-medium">Participants</th>
                    <th className="p-4 text-gray-300 font-medium">Avg. Score</th>
                    <th className="p-4 text-gray-300 font-medium">Top Prize</th>
                    <th className="p-4 text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pastTrivia.map((event, index) => (
                    <tr key={event.id} className={index % 2 === 0 ? 'bg-gray-900/30' : 'bg-black/40'}>
                      <td className="p-4 text-white font-medium">{event.title}</td>
                      <td className="p-4 text-gray-300">{event.date}</td>
                      <td className="p-4 text-gray-300">{event.participants}</td>
                      <td className="p-4 text-gray-300">{event.avgScore}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <ChonkTokenLogo size={20} />
                          <span className="ml-2 text-amber-400">{event.topPrize}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Button variant="outline" size="sm" className="border-blue-500/30 hover:bg-blue-900/30">
                          View Results
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="leaderboard">
          <Card className="bg-black/40 border-pink-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-400" />
                Global Leaderboard
              </CardTitle>
              <CardDescription className="text-gray-400">
                Top CHONK9K trivia players this month
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="overflow-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-800/50 text-left">
                      <th className="p-4 text-gray-300 font-medium">Rank</th>
                      <th className="p-4 text-gray-300 font-medium">Player</th>
                      <th className="p-4 text-gray-300 font-medium">Score</th>
                      <th className="p-4 text-gray-300 font-medium">Accuracy</th>
                      <th className="p-4 text-gray-300 font-medium">Tokens Earned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 10 }).map((_, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-900/30' : 'bg-black/40'}>
                        <td className="p-4">
                          <div className="flex items-center justify-center">
                            {index < 3 ? (
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-black font-bold
                                ${index === 0 ? 'bg-amber-400' : index === 1 ? 'bg-gray-300' : 'bg-amber-700'}`}>
                                {index + 1}
                              </div>
                            ) : (
                              <div className="text-gray-400 font-medium">
                                #{index + 1}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold">
                              {String.fromCharCode(65 + index)}
                            </div>
                            <div>
                              <div className="text-white font-medium">Player {String.fromCharCode(65 + index)}</div>
                              <div className="text-xs text-gray-400">{index < 3 ? 'Diamond' : index < 6 ? 'Gold' : 'Silver'} Rank</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-white font-medium">{Math.floor(1000 - (index * 50))}</td>
                        <td className="p-4 text-gray-300">{Math.floor(95 - (index * 2))}%</td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <ChonkTokenLogo size={20} />
                            <span className="ml-2 text-amber-400">{Math.floor(1000 - (index * 75))}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="mystats">
          {isConnected ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <Card className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 border-pink-500/30 md:col-span-8">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-blue-400" />
                    My Trivia Stats
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Your personal performance in CHONK9K trivia challenges
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-black/40 border border-blue-500/30 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Questions Answered</div>
                      <div className="text-2xl font-bold text-white">{myStats.questionsAnswered}</div>
                    </div>
                    
                    <div className="bg-black/40 border border-green-500/30 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Correct Answers</div>
                      <div className="text-2xl font-bold text-green-400">{myStats.correctAnswers}</div>
                    </div>
                    
                    <div className="bg-black/40 border border-amber-500/30 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Accuracy</div>
                      <div className="text-2xl font-bold text-amber-400">{myStats.accuracy}</div>
                    </div>
                    
                    <div className="bg-black/40 border border-pink-500/30 rounded-lg p-4">
                      <div className="text-sm text-gray-400 mb-1">Current Streak</div>
                      <div className="text-2xl font-bold text-pink-400">{myStats.streak} days</div>
                    </div>
                  </div>
                  
                  <div className="mt-6 bg-black/40 border border-blue-500/30 rounded-lg p-4">
                    <div className="text-sm text-gray-400 mb-3">Performance by Category</div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">Blockchain Basics</span>
                          <span className="text-blue-400">92%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full">
                          <div className="h-2 bg-blue-500 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">Tokenomics</span>
                          <span className="text-green-400">78%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full">
                          <div className="h-2 bg-green-500 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">CHONK9K Specific</span>
                          <span className="text-pink-400">85%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full">
                          <div className="h-2 bg-pink-500 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-300">DeFi & NFTs</span>
                          <span className="text-amber-400">65%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full">
                          <div className="h-2 bg-amber-500 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-black/40 border-amber-500/30 md:col-span-4">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-amber-400" />
                    Rewards & Ranking
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="bg-gradient-to-br from-amber-900/30 to-yellow-900/30 rounded-lg p-4 border border-amber-500/30">
                    <div className="text-sm text-gray-400 mb-2">Total CHONK9K Earned</div>
                    <div className="flex items-center">
                      <ChonkTokenLogo size={32} />
                      <span className="ml-3 text-3xl font-bold text-amber-400">{myStats.tokensEarned}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-1 bg-black/60 rounded-lg p-4 border border-blue-500/30">
                      <div className="text-sm text-gray-400 mb-1">Global Rank</div>
                      <div className="text-xl font-bold text-white">{myStats.rank}</div>
                    </div>
                    
                    <div className="flex-1 bg-black/60 rounded-lg p-4 border border-pink-500/30">
                      <div className="text-sm text-gray-400 mb-1">Level</div>
                      <div className="text-xl font-bold text-amber-400">{myStats.level}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-400 mb-3">Achievements</div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 bg-black/60 rounded-lg p-3 border border-green-500/30">
                        <div className="h-10 w-10 rounded-full bg-green-900 flex items-center justify-center">
                          <Trophy className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium">First Blood</div>
                          <div className="text-xs text-gray-400">Won your first trivia challenge</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-black/60 rounded-lg p-3 border border-blue-500/30">
                        <div className="h-10 w-10 rounded-full bg-blue-900 flex items-center justify-center">
                          <Flame className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-white font-medium">On Fire</div>
                          <div className="text-xs text-gray-400">3+ day answer streak</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-black/60 rounded-lg p-3 border border-gray-500/30">
                        <div className="h-10 w-10 rounded-full bg-gray-900 flex items-center justify-center">
                          <Award className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <div className="text-gray-400 font-medium">Trivia Master</div>
                          <div className="text-xs text-gray-500">100 correct answers (58/100)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="inline-block p-6 rounded-full bg-gray-800/50 mb-4">
                <Trophy className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Connect Wallet to View Stats</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                Connect your wallet to track your trivia performance and earn CHONK9K rewards.
              </p>
              <Button className="bg-pink-600 hover:bg-pink-700">
                Connect Wallet
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TriviaPage;