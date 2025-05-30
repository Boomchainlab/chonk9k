import React from 'react';
import ChonkMoodIndicator from '@/components/ChonkMoodIndicator';
import { useQuery } from '@tanstack/react-query';

interface TokenResponse {
  status: {
    timestamp: string;
    error_code: number;
    error_message: string | null;
  };
  data: {
    CHONK9K: {
      id: number;
      name: string;
      symbol: string;
      quote: {
        USD: {
          price: number;
          percent_change_24h: number;
          volume_24h: number;
          market_cap: number;
        };
      };
    };
  };
}

const EmbedWidget: React.FC = () => {
  // Fetch token price data
  const { data: tokenData, isLoading } = useQuery<TokenResponse>({
    queryKey: ['/api/crypto/search/CHONK9K'],
    staleTime: 60000, // Refresh data every 60 seconds
  });

  const formatPercentage = (value: number | undefined): string => {
    if (value === undefined) return '0.00%';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Format price with appropriate decimals
  const formatPrice = (price: number | undefined): string => {
    if (price === undefined) return '$0.00';
    
    // If price is very small (less than 0.01), show more decimal places
    if (price < 0.01) {
      return `$${price.toFixed(8)}`;
    }
    
    // Otherwise show standard 2 decimal places
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="p-4 max-w-xs mx-auto bg-card border rounded-lg shadow-md">
      <div className="flex flex-col items-center">
        <div className="text-center mb-2">
          <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]">
            CHONK9K Mood
          </h3>
        </div>
        
        <ChonkMoodIndicator size="md" />
        
        {!isLoading && tokenData?.data?.CHONK9K && (
          <div className="mt-2 text-center">
            <div className="text-lg font-bold">
              {formatPrice(tokenData.data.CHONK9K.quote?.USD?.price)}
            </div>
            <div className={`text-sm font-medium ${tokenData.data.CHONK9K.quote?.USD?.percent_change_24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatPercentage(tokenData.data.CHONK9K.quote?.USD?.percent_change_24h)} (24h)
            </div>
          </div>
        )}
      </div>
      
      <div className="text-xs text-center text-muted-foreground mt-4">
        <a 
          href="https://boomchainlabgravatar.link/token/mood" 
          className="hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Full Mood Tracker
        </a>
      </div>
    </div>
  );
};

export default EmbedWidget;
