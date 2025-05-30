import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { useChonkWallet } from "@/hooks/useChonkWallet";
import { ArrowDownUp, Info, Settings } from "lucide-react";
import { CHONK9K_TOKEN_ADDRESS, getChonk9kSwapRoutes, SwapRoute } from "@/lib/solanaTokenService";

const SwapTokenInterface: React.FC = () => {
  const { toast } = useToast();
  const { account, connectWallet } = useChonkWallet();
  const [slippage, setSlippage] = useState<number>(0.5);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [fromToken, setFromToken] = useState<string>("SOL");
  const [toToken, setToToken] = useState<string>("CHONK9K");
  const [swapRoutes, setSwapRoutes] = useState<SwapRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<SwapRoute | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Token options
  const tokenOptions = [
    { value: "SOL", label: "SOL", logo: "/images/coins/sol.png", address: "So11111111111111111111111111111111111111112" },
    { value: "USDC", label: "USDC", logo: "/images/coins/usdc.png", address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
    { value: "CHONK9K", label: "CHONK9K", logo: "/logo.png", address: CHONK9K_TOKEN_ADDRESS },
  ];

  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      fetchSwapRoutes();
    } else {
      setSwapRoutes([]);
      setSelectedRoute(null);
      setToAmount("");
    }
  }, [fromAmount, fromToken, toToken]);

  const fetchSwapRoutes = async () => {
    if (!fromAmount || isNaN(parseFloat(fromAmount))) return;
    
    try {
      setLoading(true);
      const routes = await getChonk9kSwapRoutes(parseFloat(fromAmount));
      setSwapRoutes(routes);
      
      // Select the best route by default
      const bestRoute = routes.find(route => route.bestRoute) || routes[0];
      setSelectedRoute(bestRoute);
      setToAmount(bestRoute.outputAmount.toString());
    } catch (error) {
      console.error('Error fetching swap routes:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch swap routes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSwapTokens = () => {
    // Only swap tokens if not involving CHONK9K (which should always be the target)
    if (fromToken !== "CHONK9K" && toToken !== "CHONK9K") {
      const tempFromToken = fromToken;
      setFromToken(toToken);
      setToToken(tempFromToken);
      setFromAmount("");
      setToAmount("");
    }
  };

  const handleSwap = async () => {
    if (!account) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to swap tokens',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedRoute) {
      toast({
        title: 'No route selected',
        description: 'Please select a swap route',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      // In a real application, this would connect to Jupiter/Raydium/etc API
      // and execute the swap transaction
      
      // Simulating a successful swap
      setTimeout(() => {
        toast({
          title: 'Swap successful!',
          description: `Swapped ${fromAmount} ${fromToken} to ${toAmount} ${toToken}`,
        });
        setLoading(false);
        setFromAmount("");
        setToAmount("");
      }, 2000);
      
    } catch (error) {
      console.error('Error executing swap:', error);
      toast({
        title: 'Swap failed',
        description: 'There was an error executing the swap',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  return (
    <Card className="w-full bg-black/90 backdrop-blur-xl border border-[#ff00ff]/30 text-white shadow-lg shadow-[#ff00ff]/10">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] bg-clip-text text-transparent">
            Swap Tokens
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowSettings(!showSettings)}
                  className="h-8 w-8 rounded-full text-gray-400 hover:text-white hover:bg-[#ff00ff]/10"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Swap settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription className="text-gray-400">
          Swap tokens across multiple platforms with the best rates
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {showSettings && (
          <div className="p-3 rounded-lg bg-black/60 border border-gray-800 mb-4 animate-in fade-in">
            <Label className="text-sm text-gray-400 mb-2 block">Slippage Tolerance: {slippage}%</Label>
            <div className="flex items-center gap-4">
              <Slider 
                value={[slippage]} 
                min={0.1} 
                max={5} 
                step={0.1} 
                onValueChange={(values) => setSlippage(values[0])}
                className="flex-1"
              />
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSlippage(0.5)}
                  className="h-7 px-2 border-gray-800 hover:border-[#ff00ff]/50 hover:text-[#ff00ff]"
                >
                  0.5%
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setSlippage(1.0)}
                  className="h-7 px-2 border-gray-800 hover:border-[#ff00ff]/50 hover:text-[#ff00ff]"
                >
                  1.0%
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {/* From token */}
          <div className="p-4 rounded-lg bg-black/60 border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm text-gray-400">From</Label>
              <span className="text-xs text-gray-500">Balance: 0.00</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className="bg-transparent border-0 text-xl font-medium focus-visible:ring-0 p-0 h-auto"
                />
              </div>
              <Select value={fromToken} onValueChange={setFromToken}>
                <SelectTrigger className="w-[120px] bg-black/40 border-gray-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-gray-800 text-white">
                  {tokenOptions.map((token) => (
                    <SelectItem 
                      key={token.value} 
                      value={token.value}
                      className={token.value === toToken ? 'opacity-50' : ''}
                      disabled={token.value === toToken}
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-5 h-5 rounded-full bg-center bg-no-repeat bg-contain" 
                          style={{ backgroundImage: `url(${token.logo})` }}
                        />
                        <span>{token.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Swap button */}
          <div className="flex justify-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSwapTokens}
              className="h-8 w-8 rounded-full text-gray-400 hover:text-white bg-black/60 border border-gray-800 hover:border-[#ff00ff]/50 hover:bg-[#ff00ff]/10 -my-6 z-10"
            >
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>
          
          {/* To token */}
          <div className="p-4 rounded-lg bg-black/60 border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm text-gray-400">To (estimated)</Label>
              <span className="text-xs text-gray-500">Balance: 0.00</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={toAmount}
                  disabled
                  className="bg-transparent border-0 text-xl font-medium focus-visible:ring-0 p-0 h-auto"
                />
              </div>
              <Select value={toToken} onValueChange={setToToken}>
                <SelectTrigger className="w-[120px] bg-black/40 border-gray-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border border-gray-800 text-white">
                  {tokenOptions.map((token) => (
                    <SelectItem 
                      key={token.value} 
                      value={token.value}
                      className={token.value === fromToken ? 'opacity-50' : ''}
                      disabled={token.value === fromToken}
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-5 h-5 rounded-full bg-center bg-no-repeat bg-contain" 
                          style={{ backgroundImage: `url(${token.logo})` }}
                        />
                        <span>{token.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Route selection */}
        {swapRoutes.length > 0 && (
          <div className="mt-4 space-y-2">
            <Label className="text-sm text-gray-400">Route</Label>
            <div className="grid grid-cols-1 gap-2">
              {swapRoutes.map((route) => (
                <button
                  key={route.platform}
                  className={`flex justify-between items-center p-3 rounded-lg border ${selectedRoute?.platform === route.platform
                    ? 'bg-[#ff00ff]/10 border-[#ff00ff]/50'
                    : 'bg-black/40 border-gray-800 hover:border-[#ff00ff]/30'
                  } transition-colors`}
                  onClick={() => {
                    setSelectedRoute(route);
                    setToAmount(route.outputAmount.toString());
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
                      <div 
                        className="w-5 h-5 bg-center bg-no-repeat bg-contain" 
                        style={{ 
                          backgroundImage: `url(/images/wallets/${route.platform.toLowerCase()}.png)` 
                        }}
                      />
                    </div>
                    <span>{route.platform}</span>
                    {route.bestRoute && (
                      <span className="text-xs px-1.5 py-0.5 rounded bg-[#00e0ff]/20 text-[#00e0ff]">
                        Best
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {route.outputAmount.toFixed(6)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Price Impact: {route.priceImpact.toFixed(2)}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        {!account ? (
          <Button 
            onClick={connectWallet}
            className="w-full bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white hover:opacity-90 transition-opacity"
          >
            Connect Wallet
          </Button>
        ) : (
          <Button 
            onClick={handleSwap}
            disabled={!fromAmount || !toAmount || loading || !selectedRoute}
            className="w-full bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Swapping...
              </span>
            ) : 'Swap'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SwapTokenInterface;