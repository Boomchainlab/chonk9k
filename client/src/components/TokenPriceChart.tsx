import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Layers, Activity, ArrowDown, ArrowUp } from 'lucide-react';
import type { TokenMarketData } from '@/services/tokenMarketService';

interface TokenPriceChartProps {
  marketData: TokenMarketData;
  className?: string;
}

const TokenPriceChart: React.FC<TokenPriceChartProps> = ({ 
  marketData,
  className = ''
}) => {
  const [priceHistory, setPriceHistory] = useState<{time: Date, price: number}[]>([]);
  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  
  // Generate simulated price history data
  useEffect(() => {
    const generatePriceHistory = () => {
      const now = new Date();
      const basePrice = parseFloat(marketData.price);
      const volatility = 0.05; // 5% volatility
      const data: {time: Date, price: number}[] = [];
      
      let points: number;
      let interval: number;
      
      switch(timeframe) {
        case '1h':
          points = 60;
          interval = 60 * 1000; // 1 minute in ms
          break;
        case '7d':
          points = 168;
          interval = 60 * 60 * 1000; // 1 hour in ms
          break;
        case '30d':
          points = 30;
          interval = 24 * 60 * 60 * 1000; // 1 day in ms
          break;
        case '24h':
        default:
          points = 24;
          interval = 60 * 60 * 1000; // 1 hour in ms
          break;
      }
      
      // Generate the data points
      for (let i = points; i >= 0; i--) {
        const time = new Date(now.getTime() - (i * interval));
        
        // Price simulation with random walk but trending toward current price
        const randomFactor = (Math.random() - 0.5) * 2 * volatility;
        const trendFactor = 0.2 * (i / points); // Gradually trending toward current price
        
        // More recent prices are closer to current price
        const simulatedPrice = basePrice * (1 + randomFactor) * (1 - trendFactor);
        
        data.push({
          time,
          price: simulatedPrice
        });
      }
      
      setPriceHistory(data);
    };
    
    generatePriceHistory();
  }, [marketData.price, timeframe]);
  
  // Calculate min and max for the SVG viewBox
  const minPrice = Math.min(...priceHistory.map(point => point.price)) * 0.9;
  const maxPrice = Math.max(...priceHistory.map(point => point.price)) * 1.1;
  const priceRange = maxPrice - minPrice;
  
  // Format the path for the chart
  const getPathD = () => {
    if (priceHistory.length === 0) return '';
    
    const width = 100; // percentage width
    const height = 100; // percentage height
    
    const points = priceHistory.map((point, index) => {
      const x = (index / (priceHistory.length - 1)) * width;
      const normalizedPrice = ((point.price - minPrice) / priceRange);
      const y = height - (normalizedPrice * height);
      return `${x},${y}`;
    });
    
    // Create the path with the line and area fill
    const linePath = `M ${points.join(' L ')}`;
    
    return linePath;
  };
  
  // Calculate if price is up or down over the selected timeframe
  const isPriceUp = priceHistory.length > 1 && 
    priceHistory[priceHistory.length - 1].price > priceHistory[0].price;
  
  // Calculate percentage change
  const calculateChange = () => {
    if (priceHistory.length < 2) return '0.00';
    
    const startPrice = priceHistory[0].price;
    const endPrice = priceHistory[priceHistory.length - 1].price;
    const percentChange = ((endPrice - startPrice) / startPrice) * 100;
    
    return percentChange.toFixed(2);
  };
  
  // Get gradient colors based on price direction
  const getGradientColors = () => {
    return isPriceUp ? 
      { start: '#00e0ff', end: '#00e0ff33' } : 
      { start: '#ff00ff', end: '#ff00ff33' };
  };
  
  const gradientColors = getGradientColors();
  const percentChange = calculateChange();
  
  return (
    <Card className={`bg-black/60 backdrop-blur-xl rounded-xl border border-[#ff00ff]/30 shadow-lg overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-[#ff00ff]/20 to-transparent border-b border-[#ff00ff]/30 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white flex items-center">
            <AreaChart className="mr-2 h-5 w-5 text-[#ff00ff]" />
            Price Chart
          </CardTitle>
          <div className="flex space-x-1">
            {['1h', '24h', '7d', '30d'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf as any)}
                className={`px-2 py-1 text-xs rounded-md transition-colors ${timeframe === tf ? 
                  'bg-[#ff00ff]/30 text-white' : 
                  'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
        <CardDescription className="text-gray-400 flex items-center">
          <span className={`flex items-center ${isPriceUp ? 'text-green-400' : 'text-red-400'} mr-2`}>
            {isPriceUp ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
            {percentChange}%
          </span>
          <span>in the past {timeframe}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0 h-80 relative">
        {/* Chart with gradient background */}
        <div className="absolute inset-0 p-4">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Gradient fill */}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradientColors.start} stopOpacity="0.2" />
                <stop offset="100%" stopColor={gradientColors.end} stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Area fill */}
            <path 
              d={`${getPathD()} L ${priceHistory.length > 0 ? 100 : 0},100 L 0,100 Z`} 
              fill="url(#areaGradient)" 
              stroke="none" 
            />
            
            {/* Line */}
            <path 
              d={getPathD()} 
              fill="none" 
              stroke={isPriceUp ? '#00e0ff' : '#ff00ff'} 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            
            {/* Current price dot */}
            {priceHistory.length > 0 && (
              <circle 
                cx="100" 
                cy={100 - ((priceHistory[priceHistory.length - 1].price - minPrice) / priceRange * 100)} 
                r="2" 
                fill={isPriceUp ? '#00e0ff' : '#ff00ff'} 
              />
            )}
          </svg>
          
          {/* Price labels */}
          <div className="absolute top-2 right-2 text-sm text-white bg-black/50 px-2 py-1 rounded">
            ${parseFloat(marketData.price).toFixed(8)}
          </div>
          <div className="absolute bottom-2 left-2 text-xs text-gray-400">
            {new Date().toLocaleDateString()} {timeframe}
          </div>
          
          {/* Min/Max labels */}
          <div className="absolute top-2 left-2 text-xs text-gray-400">
            High: ${maxPrice.toFixed(8)}
          </div>
          <div className="absolute bottom-12 left-2 text-xs text-gray-400">
            Low: ${minPrice.toFixed(8)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenPriceChart;