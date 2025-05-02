import React from 'react';
import TokenPerformanceMood from '@/components/TokenPerformanceMood';
import ChonkMoodIndicator from '@/components/ChonkMoodIndicator';

const TokenMood: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
            CHONK9K Mood Tracker
          </h1>
          <p className="text-lg text-muted-foreground">
            The Chonk character reacts to price movements of the $CHONK9K token
          </p>
        </div>
        
        <TokenPerformanceMood className="mb-8" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-card border rounded-lg p-4 flex flex-col items-center">
            <ChonkMoodIndicator mood="ecstatic" size="md" />
            <h3 className="mt-4 font-medium">Ecstatic</h3>
            <p className="text-sm text-center text-muted-foreground mt-2">
              When price jumps over 20%
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-4 flex flex-col items-center">
            <ChonkMoodIndicator mood="happy" size="md" />
            <h3 className="mt-4 font-medium">Happy</h3>
            <p className="text-sm text-center text-muted-foreground mt-2">
              When price increases 5-20%
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-4 flex flex-col items-center">
            <ChonkMoodIndicator mood="neutral" size="md" />
            <h3 className="mt-4 font-medium">Neutral</h3>
            <p className="text-sm text-center text-muted-foreground mt-2">
              When price changes within ±5%
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-4 flex flex-col items-center">
            <ChonkMoodIndicator mood="sad" size="md" />
            <h3 className="mt-4 font-medium">Sad</h3>
            <p className="text-sm text-center text-muted-foreground mt-2">
              When price drops 5-20%
            </p>
          </div>
          
          <div className="bg-card border rounded-lg p-4 flex flex-col items-center">
            <ChonkMoodIndicator mood="depressed" size="md" />
            <h3 className="mt-4 font-medium">Depressed</h3>
            <p className="text-sm text-center text-muted-foreground mt-2">
              When price dumps over 20%
            </p>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <p className="mb-4">
            The CHONK9K Mood Tracker monitors real-time price data and adjusts the character's expression and mood based on the token's 24-hour performance. As prices change, so does Chonk's mood!            
          </p>
          <p className="mb-4">
            This feature uses the CoinMarketCap API to get the latest price data and calculates the mood based on percentage changes over different time periods.            
          </p>
          <div className="flex items-center border-t pt-4 mt-4">
            <ChonkMoodIndicator size="md" className="mr-4" />
            <div>
              <p className="font-medium">Real-time Updates</p>
              <p className="text-sm text-muted-foreground">Data refreshes every 60 seconds</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenMood;
