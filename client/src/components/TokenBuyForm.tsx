import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface TokenBuyFormProps {
  currentPrice: string;
  nextPrice: string;
  priceIncrease: string;
  soldAmount: string;
  totalAmount: string;
  percentageSold: number;
}

const TokenBuyForm: React.FC<TokenBuyFormProps> = ({
  currentPrice,
  nextPrice,
  priceIncrease,
  soldAmount,
  totalAmount,
  percentageSold
}) => {
  const [ethAmount, setEthAmount] = useState("0.5");
  const { toast } = useToast();
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and a single decimal point
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setEthAmount(value);
    }
  };
  
  const handleBuyToken = () => {
    toast({
      title: "Connect Wallet",
      description: "This would connect to your wallet in a real implementation.",
      variant: "default",
    });
  };
  
  // Calculate token amount based on ETH input and current price
  const tokenAmount = parseFloat(ethAmount) > 0
    ? Math.floor(parseFloat(ethAmount) * 0.5 / 0.00000021)
    : 0;
  
  const formattedTokenAmount = tokenAmount.toLocaleString();
  
  return (
    <div className="bg-dark/20 backdrop-blur-sm rounded-xl p-8 mb-8">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="bg-white/10 rounded-lg p-4 flex-1">
          <div className="text-white text-opacity-70 mb-2">Current Price</div>
          <div className="text-white font-['Montserrat'] font-bold text-2xl">{currentPrice}</div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4 flex-1">
          <div className="text-white text-opacity-70 mb-2">Next Price</div>
          <div className="text-white font-['Montserrat'] font-bold text-2xl">{nextPrice}</div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-4 flex-1">
          <div className="text-white text-opacity-70 mb-2">Price Increase</div>
          <div className="text-white font-['Montserrat'] font-bold text-2xl">{priceIncrease}</div>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="bg-dark/30 h-4 rounded-full overflow-hidden mb-2">
          <div className="bg-white h-full rounded-full" style={{ width: `${percentageSold}%` }}></div>
        </div>
        <div className="flex justify-between text-white text-sm">
          <span>{soldAmount} / {totalAmount}</span>
          <span>{percentageSold}% Sold</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-white text-left mb-2">Amount in ETH</label>
          <div className="relative">
            <Input 
              type="text" 
              value={ethAmount} 
              onChange={handleAmountChange}
              className="w-full bg-dark/40 text-white rounded-lg border border-white/20 p-3 focus:outline-none focus:border-white/50" 
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70">ETH</div>
          </div>
          <div className="text-white/70 text-left text-sm mt-1">≈ {formattedTokenAmount} $CHONK9K</div>
        </div>
        
        <div className="flex items-end">
          <Button 
            className="w-full bg-white hover:bg-white/90 transition text-primary font-['Montserrat'] font-bold py-3 px-6 rounded-lg text-lg" 
            onClick={handleBuyToken}
          >
            Buy $CHONK9K
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TokenBuyForm;
