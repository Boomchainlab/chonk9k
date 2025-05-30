import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, Gift, CreditCard, TrendingUp, Coins, Award, Trophy, Rocket, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useChonkWallet } from '@/hooks/useChonkWallet';

interface Reward {
  id: string;
  name: string;
  description: string;
  probability: number; // Percentage probability (1-100)
  color: string;
  icon: React.ReactNode;
  value: string;
}

interface SpinWheelProps {
  className?: string;
  onReward?: (reward: Reward) => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ className = '', onReward }) => {
  const { toast } = useToast();
  const { account } = useChonkWallet();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [spinsRemaining, setSpinsRemaining] = useState(3);
  const [nextSpinTime, setNextSpinTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const wheelRef = useRef<HTMLDivElement>(null);
  
  // Rewards array with different probabilities
  const rewards: Reward[] = [
    {
      id: '1',
      name: 'Jackpot!',
      description: '5000 $CHONK9K tokens',
      probability: 1, // 1% chance
      color: '#ff00ff',
      icon: <Award className="h-5 w-5" />,
      value: '5000'
    },
    {
      id: '2',
      name: 'Major Prize',
      description: '1000 $CHONK9K tokens',
      probability: 4, // 4% chance
      color: '#00e0ff',
      icon: <Trophy className="h-5 w-5" />,
      value: '1000'
    },
    {
      id: '3',
      name: 'Medium Prize',
      description: '500 $CHONK9K tokens',
      probability: 10, // 10% chance
      color: '#FFA500',
      icon: <Rocket className="h-5 w-5" />,
      value: '500'
    },
    {
      id: '4',
      name: 'Small Prize',
      description: '100 $CHONK9K tokens',
      probability: 15, // 15% chance
      color: '#4CAF50',
      icon: <Coins className="h-5 w-5" />,
      value: '100'
    },
    {
      id: '5',
      name: 'Micro Prize',
      description: '50 $CHONK9K tokens',
      probability: 20, // 20% chance
      color: '#2196F3',
      icon: <TrendingUp className="h-5 w-5" />,
      value: '50'
    },
    {
      id: '6',
      name: 'Mini Prize',
      description: '20 $CHONK9K tokens',
      probability: 50, // 50% chance
      color: '#9C27B0',
      icon: <Gift className="h-5 w-5" />,
      value: '20'
    },
  ];

  // Timer for next spin
  useEffect(() => {
    // Check local storage for next spin time
    const storedNextSpinTime = localStorage.getItem('chonk9k_next_spin_time');
    const storedSpinsRemaining = localStorage.getItem('chonk9k_spins_remaining');
    
    if (storedNextSpinTime) {
      setNextSpinTime(new Date(storedNextSpinTime));
    }
    
    if (storedSpinsRemaining) {
      setSpinsRemaining(parseInt(storedSpinsRemaining, 10));
    }
    
    const timer = setInterval(() => {
      if (nextSpinTime) {
        const now = new Date();
        const diff = nextSpinTime.getTime() - now.getTime();
        
        if (diff <= 0) {
          setNextSpinTime(null);
          setSpinsRemaining(prev => Math.min(prev + 1, 3));
          localStorage.setItem('chonk9k_spins_remaining', String(Math.min(spinsRemaining + 1, 3)));
          localStorage.removeItem('chonk9k_next_spin_time');
          setTimeRemaining('');
        } else {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [nextSpinTime, spinsRemaining]);

  // Function to spin the wheel
  const spinWheel = () => {
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Connect your wallet to spin the wheel",
        variant: "destructive"
      });
      return;
    }
    
    if (isSpinning) return;
    
    if (spinsRemaining <= 0) {
      toast({
        title: "No Spins Left",
        description: `Next spin available in ${timeRemaining}`,
        variant: "destructive"
      });
      return;
    }
    
    setIsSpinning(true);
    setSelectedReward(null);
    
    // Determine the winning reward based on probabilities
    const randomValue = Math.random() * 100;
    let cumulativeProbability = 0;
    let selectedRewardIndex = 0;
    
    for (let i = 0; i < rewards.length; i++) {
      cumulativeProbability += rewards[i].probability;
      if (randomValue <= cumulativeProbability) {
        selectedRewardIndex = i;
        break;
      }
    }
    
    // Determine the rotation to land on the selected reward
    // Each slice is (360 / rewards.length) degrees
    const sliceSize = 360 / rewards.length;
    // Calculate the middle position of the selected slice
    const targetRotation = 360 - (selectedRewardIndex * sliceSize) - (sliceSize / 2);
    // Add multiple full rotations plus the target position
    const spinRotation = 1440 + targetRotation; // 4 full rotations (4 * 360 = 1440) + target
    
    // Set the rotation with smooth animation
    setRotation(spinRotation);
    
    // After spinning completes
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedReward(rewards[selectedRewardIndex]);
      
      // Update spins remaining
      setSpinsRemaining(prev => prev - 1);
      localStorage.setItem('chonk9k_spins_remaining', String(spinsRemaining - 1));
      
      // If this was the last spin, set the next spin time
      if (spinsRemaining === 1) {
        const nextTime = new Date();
        nextTime.setHours(nextTime.getHours() + 24); // 24 hour cooldown
        setNextSpinTime(nextTime);
        localStorage.setItem('chonk9k_next_spin_time', nextTime.toISOString());
      }
      
      // Call onReward callback if provided
      if (onReward) {
        onReward(rewards[selectedRewardIndex]);
      }
      
      // Show toast with the reward
      toast({
        title: rewards[selectedRewardIndex].name,
        description: `You won ${rewards[selectedRewardIndex].description}!`,
      });
    }, 5000); // 5 seconds for the wheel to complete spinning
  };

  return (
    <Card className={`bg-black/80 border border-[#ff00ff]/30 ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl text-center font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
          Spin the Fortune Wheel
        </CardTitle>
        <CardDescription className="text-center text-gray-400">
          Spin to win $CHONK9K tokens and other rewards!
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center space-y-4">
        {/* Wheel Container */}
        <div className="relative w-64 h-64 mb-6">
          {/* Wheel Pointer/Indicator */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-[#ff00ff] text-2xl">
            <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[20px] border-l-transparent border-r-transparent border-t-[#ff00ff]"></div>
          </div>
          
          {/* Spinning Wheel */}
          <div 
            ref={wheelRef}
            className="w-full h-full rounded-full border-4 border-[#ff00ff] overflow-hidden flex items-center justify-center relative"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 5s cubic-bezier(0.2, 0.8, 0.3, 1)' : 'none'
            }}
          >
            {/* Wheel Segments */}
            {rewards.map((reward, index) => {
              const segmentAngle = 360 / rewards.length;
              const rotateAngle = index * segmentAngle;
              
              return (
                <div 
                  key={reward.id}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    transform: `rotate(${rotateAngle}deg)`,
                    transformOrigin: 'center',
                    clipPath: `polygon(50% 50%, 50% 0, ${50 + 50 * Math.cos((segmentAngle * Math.PI) / 180)}% ${50 - 50 * Math.sin((segmentAngle * Math.PI) / 180)}%, 50% 50%)`
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: reward.color }}>
                    <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-white font-semibold">
                      {reward.icon}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Center Circle */}
            <div className="absolute w-10 h-10 rounded-full bg-black border-2 border-[#ff00ff] z-10"></div>
          </div>
        </div>
        
        {/* Spins Remaining */}
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-black/50 text-white border-[#00e0ff]/30">
            <Clock className="mr-1 h-4 w-4 text-[#00e0ff]" /> {spinsRemaining} Spins Remaining
          </Badge>
          
          {nextSpinTime && spinsRemaining < 3 && (
            <Badge variant="outline" className="bg-black/50 text-white border-[#ff00ff]/30">
              Next spin: {timeRemaining}
            </Badge>
          )}
        </div>
        
        {/* Selected Reward Display */}
        {selectedReward && (
          <div className="mt-4 p-4 rounded-lg bg-black/50 border border-gray-600 w-full text-center" style={{ borderColor: `${selectedReward.color}30` }}>
            <h3 className="font-bold text-lg text-white">{selectedReward.name}</h3>
            <p className="text-gray-300">{selectedReward.description}</p>
            <div className="flex justify-center mt-2">
              <Badge className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white">
                {selectedReward.icon} {selectedReward.value} $CHONK9K
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <Button 
          className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white px-8 py-2 rounded-lg shadow-lg hover:opacity-90 transition-opacity"
          disabled={isSpinning || spinsRemaining <= 0 || !account}
          onClick={spinWheel}
        >
          {isSpinning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Spinning...
            </>
          ) : (
            <>Spin to Win!</>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SpinWheel;