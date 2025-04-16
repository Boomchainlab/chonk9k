import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PriceData {
  currentPrice: string;
  change: string;
  lowHigh: string;
  volume: string;
}

interface PriceChartProps {
  priceData: PriceData;
}

const PriceChart: React.FC<PriceChartProps> = ({ priceData }) => {
  const [timeframe, setTimeframe] = React.useState<"24H" | "7D" | "30D" | "ALL">("24H");

  return (
    <Card className="card-gradient rounded-xl border border-gray-800">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h3 className="font-['Montserrat'] font-semibold text-xl text-white mb-4 md:mb-0">$CHONK9K Price Chart</h3>
          
          <div className="flex space-x-2">
            <Button 
              variant={timeframe === "24H" ? "default" : "outline"} 
              className={timeframe === "24H" ? "bg-primary text-white" : "bg-gray-800 text-gray-300"}
              onClick={() => setTimeframe("24H")}
              size="sm"
            >
              24H
            </Button>
            <Button 
              variant={timeframe === "7D" ? "default" : "outline"}
              className={timeframe === "7D" ? "bg-primary text-white" : "bg-gray-800 text-gray-300"}
              onClick={() => setTimeframe("7D")}
              size="sm"
            >
              7D
            </Button>
            <Button 
              variant={timeframe === "30D" ? "default" : "outline"}
              className={timeframe === "30D" ? "bg-primary text-white" : "bg-gray-800 text-gray-300"}
              onClick={() => setTimeframe("30D")}
              size="sm"
            >
              30D
            </Button>
            <Button 
              variant={timeframe === "ALL" ? "default" : "outline"}
              className={timeframe === "ALL" ? "bg-primary text-white" : "bg-gray-800 text-gray-300"}
              onClick={() => setTimeframe("ALL")}
              size="sm"
            >
              ALL
            </Button>
          </div>
        </div>
        
        <div className="chart-container h-[250px] relative">
          <div className="w-full h-full relative overflow-hidden rounded-lg">
            <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-primary/20 to-transparent"></div>
            <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
              <path
                d="M0,25 L2,22 L4,23 L6,21 L8,20 L10,22 L12,18 L14,17 L16,19 L18,16 L20,15 L22,13 L24,14 L26,11 L28,12 L30,10 L32,9 L34,11 L36,8 L38,7 L40,5 L42,6 L44,4 L46,5 L48,3 L50,4 L52,2 L54,3 L56,1 L58,2 L60,0 L62,2 L64,3 L66,2 L68,3 L70,4 L72,3 L74,5 L76,4 L78,6 L80,5 L82,7 L84,8 L86,7 L88,9 L90,8 L92,10 L94,9 L96,8 L98,7 L100,8"
                fill="none"
                stroke="#FF4500"
                strokeWidth="0.5"
              ></path>
            </svg>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div>
            <div className="text-gray-400 text-sm">Current Price</div>
            <div className="text-white font-medium">{priceData.currentPrice}</div>
          </div>
          
          <div>
            <div className="text-gray-400 text-sm">24h Change</div>
            <div className="text-accent font-medium">{priceData.change}</div>
          </div>
          
          <div>
            <div className="text-gray-400 text-sm">24h Low / High</div>
            <div className="text-white font-medium">{priceData.lowHigh}</div>
          </div>
          
          <div>
            <div className="text-gray-400 text-sm">Trading Volume</div>
            <div className="text-white font-medium">{priceData.volume}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
