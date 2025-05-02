import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

type MoodState = 'ecstatic' | 'happy' | 'neutral' | 'sad' | 'depressed';

interface ChonkMoodIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showDetails?: boolean;
  mood?: MoodState;  // Allow manual override of mood
}

const ChonkMoodIndicator: React.FC<ChonkMoodIndicatorProps> = ({ 
  size = 'md', 
  className = '',
  showDetails = true,
  mood: manualMood, // Allow for manual override of mood
}) => {
  // State for the current mood of the Chonk character
  const [calculatedMood, setCalculatedMood] = useState<MoodState>('neutral');
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0);
  
  // Use manual mood if provided, otherwise use calculated mood
  const mood = manualMood || calculatedMood;
  
  // Skip API call if manual mood is provided
  const skipQuery = !!manualMood;
  
  // Fetch token price data from CoinMarketCap API wrapper
  const { data: tokenData, isLoading, error } = useQuery({
    queryKey: ['/api/crypto/search/CHONK9K'],
    staleTime: 60000, // Refresh data every 60 seconds
    enabled: !skipQuery, // Only run query if not using manual mood
  });

  // Determine mood based on price change percentage
  useEffect(() => {
    if (skipQuery) return; // Skip this effect if manual mood is provided
    
    if (tokenData?.data?.CHONK9K) {
      const priceData = tokenData.data.CHONK9K;
      const change24h = priceData.quote?.USD?.percent_change_24h || 0;
      setPriceChangePercent(change24h);
      
      // Set mood based on price change
      if (change24h >= 20) {
        setCalculatedMood('ecstatic');
      } else if (change24h >= 5) {
        setCalculatedMood('happy');
      } else if (change24h >= -5) {
        setCalculatedMood('neutral');
      } else if (change24h >= -20) {
        setCalculatedMood('sad');
      } else {
        setCalculatedMood('depressed');
      }
    }
  }, [tokenData, skipQuery]);

  // Generate Chonk's facial expression based on mood
  const getFaceForMood = () => {
    switch(mood) {
      case 'ecstatic':
        return '(^♥ω♥^)$$$';
      case 'happy':
        return '(^•ω•^)$';
      case 'neutral':
        return '(^._.^)';
      case 'sad':
        return '(^>.<^)';
      case 'depressed':
        return '(^;_;^)';
      default:
        return '(^._.^)';
    }
  };

  // Generate text description of mood
  const getMoodDescription = () => {
    switch(mood) {
      case 'ecstatic':
        return 'Ecstatic! CHONK to the moon! 🚀';
      case 'happy':
        return 'Happy! CHONK is pumping! 📈';
      case 'neutral':
        return 'Neutral. HODLing strong. 💎';
      case 'sad':
        return 'Sad. Market is down. 📉';
      case 'depressed':
        return 'Depressed. Buy the dip? 💔';
      default:
        return 'Observing the market.';
    }
  };

  // Generate color for the mood
  const getMoodColor = () => {
    switch(mood) {
      case 'ecstatic':
        return 'text-fuchsia-500';
      case 'happy':
        return 'text-green-500';
      case 'neutral':
        return 'text-blue-400';
      case 'sad':
        return 'text-amber-500';
      case 'depressed':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  // Dynamic sizing classes
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl'
  };

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className={`${sizeClasses[size]} font-mono text-muted-foreground animate-pulse`}>
          (^•ω•^)?
        </div>
        {showDetails && <p className="text-xs mt-1 text-muted-foreground">Loading mood...</p>}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className={`${sizeClasses[size]} font-mono text-red-500`}>
          (^×_×^)!
        </div>
        {showDetails && <p className="text-xs mt-1 text-red-400">Error loading mood</p>}
      </div>
    );
  }

  // For manually set moods or successful API queries
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div 
        className={`${sizeClasses[size]} font-mono ${getMoodColor()} transition-all duration-500 hover:scale-110 cursor-help`}
        title={skipQuery ? undefined : `Price change: ${priceChangePercent.toFixed(2)}%`}
      >
        {getFaceForMood()}
      </div>
      {showDetails && (
        <div className="mt-2 text-center">
          <p className={`text-sm font-medium ${getMoodColor()}`}>
            {getMoodDescription()}
          </p>
          {!skipQuery && (
            <p className={`text-xs ${priceChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}% (24h)
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChonkMoodIndicator;
