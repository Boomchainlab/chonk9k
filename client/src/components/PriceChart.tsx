import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface PriceData {
  currentPrice: string;
  change: string;
  lowHigh: string;
  volume: string;
}

interface PriceChartProps {
  priceData: PriceData;
  showExternalLink?: boolean;
}

const PriceChart: React.FC<PriceChartProps> = ({ priceData, showExternalLink = false }) => {
  return (
    <Card className="bg-black/60 backdrop-blur-xl rounded-xl border border-[#00e0ff]/30 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#00e0ff]/20 to-transparent border-b border-[#00e0ff]/30 pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold text-[#00e0ff] flex items-center">
            <span className="mr-2">📈</span>
            CHONK9K Price Chart
          </CardTitle>
          {showExternalLink && (
            <a 
              href="https://dexscreener.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button size="sm" variant="outline" className="h-8 bg-black/30 border-[#00e0ff]/50 text-[#00e0ff] hover:bg-[#00e0ff]/20">
                DEX Screener
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </a>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-white">{priceData.currentPrice}</div>
            <div className="text-sm text-green-500">{priceData.change}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">24h Range</div>
            <div className="text-sm text-gray-300">{priceData.lowHigh}</div>
          </div>
        </div>
        
        {/* Simulated Chart - HTML/CSS Only */}
        <div className="relative h-44 mt-6 mb-2 overflow-hidden">
          <div className="absolute bottom-0 left-0 right-0 h-40 rounded-md overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00e0ff]/10 to-[#ff00ff]/10"></div>
            <svg viewBox="0 0 500 100" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
              <path
                d="M0,50 C50,30 80,90 120,70 C160,50 200,90 250,50 C300,20 350,60 400,30 C450,15 500,40 500,50 L500,100 L0,100 Z"
                fill="url(#grad1)"
                stroke="none"
              />
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00e0ff" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ff00ff" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
            <svg viewBox="0 0 500 100" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
              <polyline
                points="0,50 50,30 80,90 120,70 160,50 200,90 250,50 300,20 350,60 400,30 450,15 500,40"
                fill="none"
                stroke="url(#grad2)"
                strokeWidth="2"
              />
              <defs>
                <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00e0ff" />
                  <stop offset="100%" stopColor="#ff00ff" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          {/* Chart Time Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-gray-500">
            <span>14:00</span>
            <span>16:00</span>
            <span>18:00</span>
            <span>20:00</span>
            <span>22:00</span>
            <span>00:00</span>
            <span>Now</span>
          </div>
        </div>
        
        {/* Volume Data */}
        <div className="flex justify-between mt-4 pt-4 border-t border-gray-800">
          <div>
            <div className="text-xs text-gray-400">24h Volume</div>
            <div className="text-sm text-white">{priceData.volume}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Market Cap</div>
            <div className="text-sm text-white">$4.2M</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;