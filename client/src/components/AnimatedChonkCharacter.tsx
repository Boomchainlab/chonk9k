import React, { useState, useEffect } from 'react';
import { useChonkWallet } from '@/hooks/useChonkWallet';

interface AnimationState {
  frameIndex: number;
  frames: string[];
  speed: number;
}

interface AnimationStates {
  idle: AnimationState;
  connecting: AnimationState;
  connected: AnimationState;
  error: AnimationState;
  celebrating: AnimationState;
}

const AnimatedChonkCharacter: React.FC = () => {
  const { account, isConnecting, balance } = useChonkWallet();
  const [currentAnimation, setCurrentAnimation] = useState<keyof AnimationStates>('idle');
  const [frame, setFrame] = useState<number>(0);
  const [celebrating, setCelebrating] = useState<boolean>(false);

  // Define different animation sets
  const animations: AnimationStates = {
    idle: {
      frames: [
        "(^._.^)", 
        "(^._.^)", 
        "(^._.^)", 
        "(^._.^)", 
        "(^.o.^)", 
        "(^._.^)"
      ],
      frameIndex: 0,
      speed: 500
    },
    connecting: {
      frames: [
        "(^._.^)", 
        "(^o.o^)", 
        "(^O_O^)", 
        "(^>.<^)", 
        "(^-.-^)"
      ],
      frameIndex: 0,
      speed: 200
    },
    connected: {
      frames: [
        "(^•ω•^)", 
        "(^•ω~^)", 
        "(^•ω•^)", 
        "(^•ω•^)"
      ],
      frameIndex: 0,
      speed: 600
    },
    error: {
      frames: [
        "(^>.<^)", 
        "(^>_<^)", 
        "(^>.<^)", 
        "(^>_<^)"
      ],
      frameIndex: 0,
      speed: 300
    },
    celebrating: {
      frames: [
        "(^•ω•^)$", 
        "(^•ω•^)$$", 
        "(^•ω•^)$$$", 
        "(^•ω~^)$$$$", 
        "(^♥ω♥^)$$$"
      ],
      frameIndex: 0,
      speed: 150
    }
  };

  // Update animation state based on wallet status
  useEffect(() => {
    if (isConnecting) {
      setCurrentAnimation('connecting');
    } else if (account) {
      setCurrentAnimation('connected');
      
      // Trigger celebration animation occasionally
      const celebrationChance = Math.random();
      if (celebrationChance > 0.7 && !celebrating) {
        setCelebrating(true);
        setCurrentAnimation('celebrating');
        
        setTimeout(() => {
          setCelebrating(false);
          setCurrentAnimation('connected');
        }, 3000);
      }
    } else {
      setCurrentAnimation('idle');
    }
  }, [account, isConnecting, celebrating]);
  
  // Handle balance changes
  useEffect(() => {
    if (account && balance && !celebrating) {
      setCelebrating(true);
      setCurrentAnimation('celebrating');
      
      setTimeout(() => {
        setCelebrating(false);
        setCurrentAnimation('connected');
      }, 3000);
    }
  }, [balance]);

  // Animation frame loop
  useEffect(() => {
    const currentState = animations[currentAnimation];
    const interval = setInterval(() => {
      setFrame((prevFrame) => (prevFrame + 1) % currentState.frames.length);
    }, currentState.speed);
    
    return () => clearInterval(interval);
  }, [currentAnimation]);

  // Get the current frame from the current animation
  const getCurrentFrame = () => {
    return animations[currentAnimation].frames[frame];
  };

  // Determine text color based on animation state
  const getTextColor = () => {
    switch(currentAnimation) {
      case 'idle': return 'text-muted-foreground';
      case 'connecting': return 'text-amber-500';
      case 'connected': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'celebrating': return 'text-pink-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`text-4xl md:text-5xl lg:text-6xl font-mono transition-all duration-200 transform hover:scale-110 ${getTextColor()}`}
        style={{
          textShadow: currentAnimation === 'celebrating' ? '0 0 5px #ff69b4, 0 0 10px #ff69b4' : 'none',
          transition: 'all 0.3s ease'
        }}
      >
        {getCurrentFrame()}
      </div>
      
      {/* Status text */}
      <div className="mt-2 text-xs md:text-sm text-muted-foreground">
        {currentAnimation === 'idle' && 'Waiting for wallet...'}
        {currentAnimation === 'connecting' && 'Connecting to wallet...'}
        {currentAnimation === 'connected' && !celebrating && `Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
        {currentAnimation === 'error' && 'Connection error!'}
        {currentAnimation === 'celebrating' && 'CHONK9K tokens detected!'}
      </div>
    </div>
  );
};

export default AnimatedChonkCharacter;
