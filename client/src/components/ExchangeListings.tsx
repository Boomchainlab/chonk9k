import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';

interface Exchange {
  name: string;
  logo: string;
  url: string;
  tradingPair: string;
  liquidityRating?: number; // 1-5
  volume24h?: string;
  tag?: "HOT" | "NEW" | "BEST";
}

interface ExchangeListingsProps {
  exchanges: Exchange[];
}

const ExchangeListings: React.FC<ExchangeListingsProps> = ({ exchanges }) => {
  return (
    <Card className="bg-black/60 backdrop-blur-xl rounded-xl border border-[#00e0ff]/30 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#00e0ff]/20 to-transparent border-b border-[#00e0ff]/30 pb-3">
        <CardTitle className="text-lg font-bold text-[#00e0ff] flex items-center">
          <span className="mr-2">💰</span>
          <span>Where to Buy</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#00e0ff]/20 scrollbar-track-transparent">
          {exchanges.map((exchange, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between p-4 hover:bg-white/5 transition-colors ${index !== exchanges.length - 1 ? 'border-b border-gray-800' : ''}`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center overflow-hidden border border-gray-700">
                  <img 
                    src={exchange.logo} 
                    alt={exchange.name} 
                    className="w-7 h-7 object-contain"
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLImageElement).src = '/images/exchanges/default.svg';
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium text-white">{exchange.name}</h3>
                    {exchange.tag && (
                      <Badge 
                        className={`ml-2 px-1.5 py-0 text-[10px] ${exchange.tag === 'HOT' ? 'bg-red-500' : exchange.tag === 'NEW' ? 'bg-green-500' : 'bg-blue-500'}`}
                      >
                        {exchange.tag}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">{exchange.tradingPair}</div>
                </div>
              </div>
              
              <div className="flex items-center">
                {exchange.volume24h && (
                  <div className="text-right mr-4 hidden sm:block">
                    <div className="text-xs text-gray-400">24h Vol</div>
                    <div className="text-sm text-white">{exchange.volume24h}</div>
                  </div>
                )}
                
                {exchange.liquidityRating && (
                  <div className="mr-4 hidden sm:block">
                    <div className="text-xs text-gray-400 mb-1">Liquidity</div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`w-2 h-2 rounded-full mr-1 ${i < exchange.liquidityRating! ? 'bg-[#00e0ff]' : 'bg-gray-700'}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                <a 
                  href={exchange.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <Button size="sm" variant="outline" className="h-8 bg-black/30 border-[#00e0ff]/50 text-[#00e0ff] hover:bg-[#00e0ff]/20">
                    Trade
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExchangeListings;