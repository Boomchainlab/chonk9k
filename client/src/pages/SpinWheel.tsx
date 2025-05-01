import React, { useState, useEffect } from 'react';
import { useChonkWallet } from '@/hooks/useChonkWallet';
import { useToast } from '@/hooks/use-toast';
// Use a simple div instead of a Layout component
import { Link } from 'wouter';
// Import buffer polyfill before solanaTokenService
import '@/lib/buffer-polyfill';
import { transferTokens } from '@/lib/solanaTokenService';
import SpinWheelComponent from '@/components/SpinWheel';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, Trophy, History, Users, ArrowRight, Loader2 } from 'lucide-react';

interface UserReward {
  id: string;
  timestamp: Date;
  rewardName: string;
  rewardValue: string;
  rewardColor: string;
}

const SpinWheelPage: React.FC = () => {
  const { account } = useChonkWallet();
  const { toast } = useToast();
  const [rewardHistory, setRewardHistory] = useState<UserReward[]>([]);
  const [totalEarned, setTotalEarned] = useState('0');
  const [leaderboard, setLeaderboard] = useState<{name: string, value: string}[]>([]);
  const [isTransferring, setIsTransferring] = useState(false);
  
  // Load reward history from local storage
  useEffect(() => {
    const storedHistory = localStorage.getItem('chonk9k_reward_history');
    const storedTotalEarned = localStorage.getItem('chonk9k_total_earned');
    
    if (storedHistory) {
      try {
        setRewardHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error('Error parsing reward history:', e);
      }
    }
    
    if (storedTotalEarned) {
      setTotalEarned(storedTotalEarned);
    }
    
    // Mock leaderboard data
    setLeaderboard([
      { name: 'Crypto0xWhale', value: '25750' },
      { name: 'Chonker123', value: '18900' },
      { name: 'SolanaMaster', value: '15500' },
      { name: 'TokenHunter', value: '12300' },
      { name: 'BaseChad', value: '10750' },
    ]);
  }, []);

  // Handle new rewards
  const handleReward = (reward: any) => {
    if (!account) return;
    
    const newReward: UserReward = {
      id: Date.now().toString(),
      timestamp: new Date(),
      rewardName: reward.name,
      rewardValue: reward.value,
      rewardColor: reward.color
    };
    
    // Add to history
    const updatedHistory = [newReward, ...rewardHistory].slice(0, 10); // Keep only the latest 10 rewards
    setRewardHistory(updatedHistory);
    localStorage.setItem('chonk9k_reward_history', JSON.stringify(updatedHistory));
    
    // Update total earned
    const newTotal = (parseInt(totalEarned) + parseInt(reward.value)).toString();
    setTotalEarned(newTotal);
    localStorage.setItem('chonk9k_total_earned', newTotal);
  };
  
  // Handle sending tokens to specified address
  const handleSendTokens = async () => {
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to send tokens",
        variant: "destructive"
      });
      return;
    }
    
    setIsTransferring(true);
    
    // The recipient address specified by the user
    const recipientAddress = "2Lp2SGS9AKYVKCrizjzJLPHn4swatnbvEQ2UB2bKorJy";
    const amount = 1000; // Send 1000 CHONK9K tokens
    
    try {
      const result = await transferTokens(recipientAddress, amount);
      
      if (result.success) {
        toast({
          title: "Tokens Sent Successfully",
          description: result.message,
        });
      } else {
        toast({
          title: "Failed to Send Tokens",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error sending tokens:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while sending tokens",
        variant: "destructive"
      });
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
          Community Rewards
        </h1>
        <p className="text-gray-400 mb-8">
          Spin the wheel to win $CHONK9K tokens and compete on the leaderboard!
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Spinning Wheel */}
          <div className="lg:col-span-2">
            <SpinWheelComponent 
              className="h-full" 
              onReward={handleReward} 
            />
          </div>
          
          {/* Stats and History */}
          <div className="space-y-6">
            {/* User Stats */}
            <Card className="bg-black/80 border border-[#ff00ff]/30">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                    Your Rewards
                  </span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Track your earnings and progress
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {account ? (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Earned:</span>
                      <Badge className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white">
                        <Coins className="mr-1 h-4 w-4" /> {totalEarned} $CHONK9K
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Level Progress:</span>
                        <span className="text-white">
                          {Math.min(Math.floor(parseInt(totalEarned) / 1000), 10)}/10
                        </span>
                      </div>
                      <Progress 
                        value={Math.min((parseInt(totalEarned) / 10000) * 100, 100)} 
                        className="h-2 bg-gray-800"
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-400 mb-4">Connect your wallet to track rewards</p>
                    <Button 
                      className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white hover:opacity-90 transition-opacity"
                    >
                      Connect Wallet
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Reward History */}
            <Card className="bg-black/80 border border-[#ff00ff]/30">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                    Reward History
                  </span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your recent rewards
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {account ? (
                  rewardHistory.length > 0 ? (
                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                      {rewardHistory.map((reward) => (
                        <div 
                          key={reward.id} 
                          className="flex items-center justify-between p-2 rounded-lg bg-black/50 border border-gray-800"
                        >
                          <div className="flex items-center">
                            <div 
                              className="w-8 h-8 rounded-full mr-2 flex items-center justify-center" 
                              style={{ backgroundColor: reward.rewardColor }}
                            >
                              <Trophy className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium text-white">{reward.rewardName}</div>
                              <div className="text-xs text-gray-400">
                                {new Date(reward.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="border-[#00e0ff]/30 text-[#00e0ff]">
                            {reward.rewardValue} $CHONK9K
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-400">
                      <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No rewards yet</p>
                      <p className="text-sm">Spin the wheel to earn rewards!</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-4 text-gray-400">
                    <p>Connect your wallet to see history</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Leaderboard */}
            <Card className="bg-black/80 border border-[#ff00ff]/30">
              <CardHeader>
                <CardTitle className="text-xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                    Leaderboard
                  </span>
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Top reward earners this week
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  {leaderboard.map((entry, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-2 rounded-lg bg-black/50 border border-gray-800"
                    >
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] mr-2 flex items-center justify-center text-xs font-bold text-white">
                          {index + 1}
                        </div>
                        <span className="text-white">{entry.name}</span>
                      </div>
                      <Badge variant="outline" className="border-[#00e0ff]/30 text-[#00e0ff]">
                        {entry.value} $CHONK9K
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button variant="outline" className="w-full border-[#ff00ff]/30 text-[#ff00ff] hover:bg-[#ff00ff]/10">
                  View Full Leaderboard <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Token Transfer Section */}
        <div className="mt-8 border-t border-[#ff00ff]/30 pt-8">
          <Card className="bg-black/80 border border-[#00e0ff]/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
                  Special User Request
                </span>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Send tokens to a specific Solana wallet address
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="p-3 rounded-lg bg-black/50 border border-gray-800">
                <p className="text-white mb-2 font-semibold">Recipient Address:</p>
                <p className="text-[#00e0ff] bg-black/30 p-2 rounded-md overflow-auto break-all font-mono text-sm">
                  2Lp2SGS9AKYVKCrizjzJLPHn4swatnbvEQ2UB2bKorJy
                </p>
              </div>

              <div className="p-3 rounded-lg bg-black/50 border border-gray-800">
                <p className="text-white mb-2 font-semibold">Amount:</p>
                <p className="text-[#00e0ff] font-bold flex items-center">
                  <Coins className="mr-2 h-5 w-5" /> 1,000 $CHONK9K
                </p>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white"
                onClick={handleSendTokens}
                disabled={isTransferring || !account}
              >
                {isTransferring ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Tokens...
                  </>
                ) : (
                  <>Send Tokens</>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
      </div>
    </div>
  );
};

export default SpinWheelPage;