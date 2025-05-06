import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useChonkWallet } from "@/hooks/useChonkWallet";
import { CHONK9K_TOKEN_ADDRESS, getChonk9kLiquidityPools, addLiquidityToRaydium, LiquidityPool } from "@/lib/solanaTokenService";

const LiquidityProvider: React.FC = () => {
  const { toast } = useToast();
  const { account, connectWallet } = useChonkWallet();
  const [liquidityPools, setLiquidityPools] = useState<LiquidityPool[]>([]);
  const [loading, setLoading] = useState(true);
  const [tokenAmount, setTokenAmount] = useState<string>('');
  const [pairedTokenAmount, setPairedTokenAmount] = useState<string>('');
  const [selectedPairedToken, setSelectedPairedToken] = useState<string>('USDC');
  const [slippage, setSlippage] = useState<number>(0.5);

  useEffect(() => {
    const fetchLiquidityPools = async () => {
      try {
        setLoading(true);
        const pools = await getChonk9kLiquidityPools();
        setLiquidityPools(pools);
      } catch (error) {
        console.error('Error fetching liquidity pools:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch liquidity pools',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLiquidityPools();
  }, [toast]);

  const handleAddLiquidity = async () => {
    if (!account) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to add liquidity',
        variant: 'destructive',
      });
      return;
    }

    if (!tokenAmount || !pairedTokenAmount) {
      toast({
        title: 'Invalid input',
        description: 'Please enter valid token amounts',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      const pairedTokenMint = selectedPairedToken === 'USDC' 
        ? 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' 
        : 'So11111111111111111111111111111111111111112';
      
      const result = await addLiquidityToRaydium(
        parseFloat(tokenAmount),
        parseFloat(pairedTokenAmount),
        pairedTokenMint,
        slippage,
        null // wallet would be passed here in a real implementation
      );

      toast({
        title: 'Success!',
        description: `Added liquidity to Raydium successfully`,
      });
      
      // Reset form
      setTokenAmount('');
      setPairedTokenAmount('');
      
      // Refresh pools
      const pools = await getChonk9kLiquidityPools();
      setLiquidityPools(pools);
      
    } catch (error) {
      console.error('Error adding liquidity:', error);
      toast({
        title: 'Error',
        description: 'Failed to add liquidity',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = (pool: LiquidityPool) => {
    return pool.quoteAmount / pool.baseAmount * Math.pow(10, pool.baseDecimals - pool.quoteDecimals);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 6,
      maximumFractionDigits: 6,
    }).format(value);
  };

  const formatTokenAmount = (amount: number, decimals: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount / Math.pow(10, decimals));
  };

  return (
    <Card className="w-full bg-black/90 backdrop-blur-xl border border-[#ff00ff]/30 text-white shadow-lg shadow-[#ff00ff]/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] bg-clip-text text-transparent">Chonk9k Raydium Liquidity</span>
          <Badge className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600">
            {CHONK9K_TOKEN_ADDRESS.substring(0, 6)}...{CHONK9K_TOKEN_ADDRESS.substring(CHONK9K_TOKEN_ADDRESS.length - 4)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pools">
          <TabsList className="w-full bg-black/60 border border-[#ff00ff]/20">
            <TabsTrigger value="pools" className="data-[state=active]:bg-[#ff00ff]/20 data-[state=active]:text-[#ff00ff]">Existing Pools</TabsTrigger>
            <TabsTrigger value="add" className="data-[state=active]:bg-[#00e0ff]/20 data-[state=active]:text-[#00e0ff]">Add Liquidity</TabsTrigger>
          </TabsList>
          <TabsContent value="pools" className="mt-4">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin w-8 h-8 border-4 border-[#ff00ff] border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {liquidityPools.map((pool) => (
                  <div key={pool.id} className="p-4 rounded-lg bg-black/60 border border-gray-800 hover:border-[#ff00ff]/30 transition-all">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff00ff] to-[#00e0ff]"></div>
                        <span className="font-medium">
                          CHONK9K / {pool.quoteMint.includes('USDC') ? 'USDC' : 'SOL'}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[#00e0ff] border-[#00e0ff]/30">
                        Raydium
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Liquidity</p>
                        <p className="font-medium">
                          {formatTokenAmount(pool.baseAmount, pool.baseDecimals)} CHONK9K + 
                          {formatTokenAmount(pool.quoteAmount, pool.quoteDecimals)} {pool.quoteMint.includes('USDC') ? 'USDC' : 'SOL'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Price</p>
                        <p className="font-medium">
                          {formatCurrency(calculatePrice(pool))}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="add" className="mt-4">
            {!account ? (
              <div className="text-center p-6">
                <p className="mb-4 text-gray-400">Connect your wallet to add liquidity</p>
                <Button 
                  onClick={connectWallet}
                  className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white hover:opacity-90 transition-opacity"
                >
                  Connect Wallet
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tokenAmount">CHONK9K Amount</Label>
                    <Input
                      id="tokenAmount"
                      placeholder="0.0"
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      className="bg-black/60 border-gray-800 focus:border-[#ff00ff]/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pairedToken">Paired Token</Label>
                    <Select 
                      value={selectedPairedToken} 
                      onValueChange={setSelectedPairedToken}
                    >
                      <SelectTrigger className="bg-black/60 border-gray-800 focus:border-[#00e0ff]/50">
                        <SelectValue placeholder="Select token" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border border-gray-800 text-white">
                        <SelectItem value="USDC">USDC</SelectItem>
                        <SelectItem value="SOL">SOL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pairedTokenAmount">{selectedPairedToken} Amount</Label>
                  <Input
                    id="pairedTokenAmount"
                    placeholder="0.0"
                    value={pairedTokenAmount}
                    onChange={(e) => setPairedTokenAmount(e.target.value)}
                    className="bg-black/60 border-gray-800 focus:border-[#00e0ff]/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="slippage">Slippage Tolerance (%)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="slippage"
                      type="number"
                      min="0.1"
                      max="5"
                      step="0.1"
                      value={slippage}
                      onChange={(e) => setSlippage(parseFloat(e.target.value))}
                      className="bg-black/60 border-gray-800 focus:border-[#ff00ff]/50"
                    />
                    <div className="flex gap-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSlippage(0.5)}
                        className="border-gray-800 hover:border-[#ff00ff]/50 hover:text-[#ff00ff]"
                      >
                        0.5%
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setSlippage(1.0)}
                        className="border-gray-800 hover:border-[#ff00ff]/50 hover:text-[#ff00ff]"
                      >
                        1.0%
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleAddLiquidity}
                  disabled={loading}
                  className="w-full mt-4 bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] text-white hover:opacity-90 transition-opacity"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Processing...
                    </span>
                  ) : (
                    'Add Liquidity'
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LiquidityProvider;