import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// This component demonstrates how the CHONK9K EIP NFT staking would work
// It's a UI prototype without actual blockchain connection

// NFT images for demo purposes
const nftImages = {
  "9001": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23f5f5f5'/><circle cx='100' cy='80' r='50' fill='%23ff69b4'/><path d='M70,100 L60,120 L85,115 Z' fill='black'/><path d='M130,100 L140,120 L115,115 Z' fill='black'/><path d='M90,130 Q100,145 110,130' stroke='black' stroke-width='2' fill='none'/><text x='65' y='170' font-family='Arial' font-size='12' fill='black'>CHONK NFT #9001 - Common</text></svg>",
  "9002": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23e0f7fa'/><circle cx='100' cy='80' r='50' fill='%2329b6f6'/><path d='M70,100 L60,120 L85,115 Z' fill='black'/><path d='M130,100 L140,120 L115,115 Z' fill='black'/><path d='M90,130 Q100,145 110,130' stroke='black' stroke-width='2' fill='none'/><text x='65' y='170' font-family='Arial' font-size='12' fill='black'>CHONK NFT #9002 - Uncommon</text></svg>",
  "9003": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23e0f2f1'/><circle cx='100' cy='80' r='50' fill='%23673ab7'/><path d='M70,100 L60,120 L85,115 Z' fill='black'/><path d='M130,100 L140,120 L115,115 Z' fill='black'/><path d='M90,130 Q100,145 110,130' stroke='black' stroke-width='2' fill='none'/><text x='65' y='170' font-family='Arial' font-size='12' fill='black'>CHONK NFT #9003 - Rare</text></svg>",
  "9004": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23fafafa'/><circle cx='100' cy='80' r='50' fill='%23ffd700'/><path d='M70,100 L60,120 L85,115 Z' fill='black'/><path d='M130,100 L140,120 L115,115 Z' fill='black'/><path d='M90,130 Q100,145 110,130' stroke='black' stroke-width='2' fill='none'/><text x='65' y='170' font-family='Arial' font-size='12' fill='black'>CHONK NFT #9004 - Legendary</text></svg>"
};

export function ChonkNFTStakingDemo() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("stake");
  const [tokenId, setTokenId] = useState("");
  const [stakedNFTs, setStakedNFTs] = useState<Array<{id: string, stakeDate: Date, rewards: number, lastUpdated: Date}>>([]);
  const [totalStaked, setTotalStaked] = useState(0);
  const [stakingAPY, setStakingAPY] = useState(12);
  const [availableNFTs, setAvailableNFTs] = useState<Array<{id: string, rarity: string, multiplier: number, image: string}>>([
    { id: "9001", rarity: "Common", multiplier: 1.0, image: nftImages["9001"] },
    { id: "9002", rarity: "Uncommon", multiplier: 1.5, image: nftImages["9002"] },
    { id: "9003", rarity: "Rare", multiplier: 2.0, image: nftImages["9003"] },
    { id: "9004", rarity: "Legendary", multiplier: 5.0, image: nftImages["9004"] },
  ]);
  const [claimableRewards, setClaimableRewards] = useState(0);
  const [lifetimeRewards, setLifetimeRewards] = useState(0);
  const [loadingStake, setLoadingStake] = useState(false);
  const [loadingClaim, setLoadingClaim] = useState(false);
  
  // Simulate reward accumulation over time
  useEffect(() => {
    const timer = setInterval(() => {
      if (stakedNFTs.length > 0) {
        // Update rewards for each staked NFT
        const updatedNFTs = stakedNFTs.map(nft => {
          const nftInfo = [{ id: "9001", multiplier: 1.0 }, { id: "9002", multiplier: 1.5 }, 
                          { id: "9003", multiplier: 2.0 }, { id: "9004", multiplier: 5.0 }]
                         .find(info => info.id === nft.id);
                         
          const multiplier = nftInfo ? nftInfo.multiplier : 1.0;
          const now = new Date();
          const timeSinceLastUpdate = (now.getTime() - nft.lastUpdated.getTime()) / 1000; // in seconds
          
          // Calculate rewards: baseRate * timePassed * multiplier / (365 * 24 * 60 * 60)
          // This gives us the proper proportion of the APY for the time passed
          const newRewards = (stakingAPY / 100) * timeSinceLastUpdate * multiplier / (365 * 24 * 60 * 60) * 100;
          
          return {
            ...nft,
            rewards: nft.rewards + newRewards,
            lastUpdated: now
          };
        });
        
        setStakedNFTs(updatedNFTs);
        
        // Update total claimable rewards
        const totalRewards = updatedNFTs.reduce((sum, nft) => sum + nft.rewards, 0);
        setClaimableRewards(Math.floor(totalRewards));
      }
    }, 5000); // Update every 5 seconds for demo purposes
    
    return () => clearInterval(timer);
  }, [stakedNFTs, stakingAPY]);
  
  // Calculate total staked value
  useEffect(() => {
    // In a real implementation, this would be the NFT floor price * number of NFTs
    const simulatedFloorPrice = 0.5; // ETH
    setTotalStaked(stakedNFTs.length * simulatedFloorPrice);
  }, [stakedNFTs]);

  // Simulate staking an NFT
  const handleStake = async () => {
    if (!tokenId) {
      toast({
        title: "Error",
        description: "Please enter a valid NFT Token ID",
        variant: "destructive"
      });
      return;
    }

    const nftToStake = availableNFTs.find(nft => nft.id === tokenId);
    if (!nftToStake) {
      toast({
        title: "Error",
        description: `NFT with ID ${tokenId} not found or not owned by you`,
        variant: "destructive"
      });
      return;
    }
    
    setLoadingStake(true);
    
    // Simulate blockchain transaction delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Add to staked NFTs
    const now = new Date();
    setStakedNFTs([...stakedNFTs, {
      id: nftToStake.id,
      stakeDate: now,
      lastUpdated: now,
      rewards: 0
    }]);

    // Remove from available NFTs
    setAvailableNFTs(availableNFTs.filter(nft => nft.id !== tokenId));
    
    setLoadingStake(false);
    
    toast({
      title: "NFT Staked Successfully",
      description: `You've staked NFT #${tokenId} (${nftToStake.rarity}) with a ${nftToStake.multiplier}x reward multiplier`,
    });

    setTokenId("");
  };

  // Simulate unstaking an NFT
  const handleUnstake = async () => {
    if (!tokenId) {
      toast({
        title: "Error",
        description: "Please enter a valid NFT Token ID",
        variant: "destructive"
      });
      return;
    }

    const nftToUnstake = stakedNFTs.find(nft => nft.id === tokenId);
    if (!nftToUnstake) {
      toast({
        title: "Error",
        description: `NFT with ID ${tokenId} is not currently staked`,
        variant: "destructive"
      });
      return;
    }
    
    setLoadingStake(true);
    
    // Simulate blockchain transaction delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Get original NFT data
    const originalNFTData = [
      { id: "9001", rarity: "Common", multiplier: 1.0, image: nftImages["9001"] },
      { id: "9002", rarity: "Uncommon", multiplier: 1.5, image: nftImages["9002"] },
      { id: "9003", rarity: "Rare", multiplier: 2.0, image: nftImages["9003"] },
      { id: "9004", rarity: "Legendary", multiplier: 5.0, image: nftImages["9004"] },
    ].find(nft => nft.id === tokenId);

    if (originalNFTData) {
      // Add back to available NFTs
      setAvailableNFTs([...availableNFTs, originalNFTData]);

      // Remove from staked NFTs
      setStakedNFTs(stakedNFTs.filter(nft => nft.id !== tokenId));
      
      // Add accumulated rewards to claimable amount
      const unstakedNFT = stakedNFTs.find(nft => nft.id === tokenId);
      if (unstakedNFT) {
        setClaimableRewards(prev => prev + Math.floor(unstakedNFT.rewards));
      }
      
      setLoadingStake(false);

      toast({
        title: "NFT Unstaked",
        description: `Successfully unstaked NFT #${tokenId}. Any earned rewards can be claimed from the Rewards tab.`,
      });

      setTokenId("");
    }
  };

  // Simulate claiming rewards
  const handleClaim = async () => {
    if (claimableRewards <= 0) {
      toast({
        title: "Error",
        description: "No rewards available to claim",
        variant: "destructive"
      });
      return;
    }
    
    setLoadingClaim(true);
    
    // Simulate blockchain transaction delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add to lifetime rewards
    setLifetimeRewards(prev => prev + claimableRewards);
    
    // Reset claimable rewards on NFTs
    setStakedNFTs(stakedNFTs.map(nft => ({
      ...nft,
      rewards: 0,
      lastUpdated: new Date()
    })));

    toast({
      title: "Rewards Claimed",
      description: `Successfully claimed ${claimableRewards} CHONK9K tokens!`,
    });

    setClaimableRewards(0);
    setLoadingClaim(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-primary/10">
        <CardTitle className="text-center text-2xl">CHONK9K NFT Staking</CardTitle>
        <CardDescription className="text-center">
          Stake your Cyber Chonk NFTs to earn CHONK9K token rewards
        </CardDescription>
      </CardHeader>
      
      {/* Dashboard Overview */}
      <div className="px-6 pb-0 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 border rounded-lg bg-card/50">
            <div className="text-sm text-muted-foreground">Total Staked NFTs</div>
            <div className="text-2xl font-bold">{stakedNFTs.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Value: ~{totalStaked.toFixed(2)} ETH</div>
          </div>
          <div className="p-4 border rounded-lg bg-card/50">
            <div className="text-sm text-muted-foreground">Claimable Rewards</div>
            <div className="text-2xl font-bold text-primary">{claimableRewards} CHONK9K</div>
            <div className="text-xs text-muted-foreground mt-1">Rewards update in real-time</div>
          </div>
          <div className="p-4 border rounded-lg bg-card/50">
            <div className="text-sm text-muted-foreground">Lifetime Rewards</div>
            <div className="text-2xl font-bold">{lifetimeRewards} CHONK9K</div>
            <div className="text-xs text-muted-foreground mt-1">From all claimed rewards</div>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 pt-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="stake">Stake NFTs</TabsTrigger>
            <TabsTrigger value="unstake">Unstake NFTs</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stake" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tokenId">NFT Token ID</Label>
                <Input 
                  id="tokenId" 
                  placeholder="Enter NFT Token ID" 
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                />
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Available NFTs to Stake</h3>
                {availableNFTs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableNFTs.map((nft) => (
                      <div 
                        key={nft.id} 
                        className="p-3 border rounded-lg cursor-pointer hover:border-primary transition-colors"
                        onClick={() => setTokenId(nft.id)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <img src={nft.image} alt={`NFT #${nft.id}`} className="w-16 h-16 rounded-md" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Cyber Chonk #{nft.id}</span>
                              <Badge className={`${nft.rarity === 'Legendary' ? 'bg-yellow-500' : nft.rarity === 'Rare' ? 'bg-blue-500' : nft.rarity === 'Uncommon' ? 'bg-green-500' : 'bg-gray-500'}`}>
                                {nft.rarity}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Reward Multiplier: {nft.multiplier}x
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Est. APY: {(stakingAPY * nft.multiplier).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 border border-dashed rounded-lg">
                    No NFTs available to stake
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="unstake" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unstakeTokenId">NFT Token ID</Label>
                <Input 
                  id="unstakeTokenId" 
                  placeholder="Enter NFT Token ID to unstake" 
                  value={tokenId}
                  onChange={(e) => setTokenId(e.target.value)}
                />
              </div>
              
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Currently Staked NFTs</h3>
                {stakedNFTs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {stakedNFTs.map((nft) => {
                      const nftInfo = [{ id: "9001", rarity: "Common", multiplier: 1.0 }, 
                                     { id: "9002", rarity: "Uncommon", multiplier: 1.5 }, 
                                     { id: "9003", rarity: "Rare", multiplier: 2.0 }, 
                                     { id: "9004", rarity: "Legendary", multiplier: 5.0 }]
                                    .find(info => info.id === nft.id);
                      
                      const rarity = nftInfo ? nftInfo.rarity : "Common";
                      const multiplier = nftInfo ? nftInfo.multiplier : 1.0;
                      
                      // Calculate staking duration
                      const now = new Date();
                      const stakingDuration = now.getTime() - nft.stakeDate.getTime();
                      const days = Math.floor(stakingDuration / (1000 * 60 * 60 * 24));
                      const hours = Math.floor((stakingDuration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                      const minutes = Math.floor((stakingDuration % (1000 * 60 * 60)) / (1000 * 60));
                      
                      return (
                        <div 
                          key={nft.id} 
                          className="p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors"
                          onClick={() => setTokenId(nft.id)}
                        >
                          <div className="flex items-start gap-4">
                            <img src={nftImages[nft.id as keyof typeof nftImages]} alt={`NFT #${nft.id}`} className="w-20 h-20 rounded-md" />
                            <div className="flex-grow">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Cyber Chonk #{nft.id}</span>
                                    <Badge className={`${rarity === 'Legendary' ? 'bg-yellow-500' : rarity === 'Rare' ? 'bg-blue-500' : rarity === 'Uncommon' ? 'bg-green-500' : 'bg-gray-500'}`}>
                                      {rarity}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Staked on {nft.stakeDate.toLocaleDateString()} at {nft.stakeDate.toLocaleTimeString()}
                                  </div>
                                  <div className="text-sm font-medium mt-1">
                                    Duration: {days > 0 ? `${days}d ` : ""}{hours}h {minutes}m
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium text-primary">{Math.floor(nft.rewards)} CHONK9K</div>
                                  <div className="text-xs text-muted-foreground">Accumulated Rewards</div>
                                </div>
                              </div>
                              
                              <div className="mt-3">
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                  <span>Rewards Accrual</span>
                                  <span>{(stakingAPY * multiplier).toFixed(1)}% APY</span>
                                </div>
                                <Progress value={Math.min(100, (nft.rewards % 100))} className="h-1" />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center p-4 border border-dashed rounded-lg">
                    No NFTs currently staked
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="rewards" className="space-y-4">
            <div className="p-6 border rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-1">Claimable Rewards</h3>
                <p className="text-5xl font-bold text-primary mb-4">{claimableRewards} CHONK9K</p>
                <div className="w-full max-w-md mx-auto h-2 bg-primary/20 rounded-full mb-6 overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all" 
                    style={{ width: `${Math.min(100, claimableRewards / 10)}%` }}
                  ></div>
                </div>
                <div className="text-sm text-muted-foreground mb-6">
                  <div>Staking {stakedNFTs.length} NFTs at base APY of {stakingAPY}%</div>
                  <div>Average reward multiplier: {stakedNFTs.length > 0 ? 
                    ((stakedNFTs.reduce((sum, nft) => {
                      const nftInfo = [{ id: "9001", multiplier: 1.0 }, { id: "9002", multiplier: 1.5 }, 
                                       { id: "9003", multiplier: 2.0 }, { id: "9004", multiplier: 5.0 }]
                                      .find(info => info.id === nft.id);
                      return sum + (nftInfo ? nftInfo.multiplier : 1.0);
                    }, 0)) / stakedNFTs.length).toFixed(2) : "0.00"}x</div>
                </div>
                <Button 
                  size="lg" 
                  className="min-w-[200px]"
                  disabled={claimableRewards <= 0 || loadingClaim}
                  onClick={handleClaim}
                >
                  {loadingClaim ? "Processing..." : `Claim ${claimableRewards} CHONK9K`}
                </Button>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Reward Rates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 border rounded-lg flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <div>
                    <div className="font-medium">Common NFTs</div>
                    <div className="text-sm text-muted-foreground">Base APY: {stakingAPY}%</div>
                  </div>
                </div>
                <div className="p-3 border rounded-lg flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div>
                    <div className="font-medium">Uncommon NFTs</div>
                    <div className="text-sm text-muted-foreground">APY: {(stakingAPY * 1.5).toFixed(1)}% (1.5x multiplier)</div>
                  </div>
                </div>
                <div className="p-3 border rounded-lg flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <div>
                    <div className="font-medium">Rare NFTs</div>
                    <div className="text-sm text-muted-foreground">APY: {(stakingAPY * 2).toFixed(1)}% (2x multiplier)</div>
                  </div>
                </div>
                <div className="p-3 border rounded-lg flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div>
                    <div className="font-medium">Legendary NFTs</div>
                    <div className="text-sm text-muted-foreground">APY: {(stakingAPY * 5).toFixed(1)}% (5x multiplier)</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between bg-card/50 border-t">
        {activeTab === "stake" && (
          <Button 
            onClick={handleStake} 
            disabled={!tokenId || availableNFTs.length === 0 || loadingStake}
            className="min-w-[120px]"
          >
            {loadingStake ? "Staking..." : "Stake NFT"}
          </Button>
        )}
        {activeTab === "unstake" && (
          <Button 
            onClick={handleUnstake} 
            disabled={!tokenId || stakedNFTs.length === 0 || loadingStake}
            className="min-w-[120px]"
          >
            {loadingStake ? "Unstaking..." : "Unstake NFT"}
          </Button>
        )}
        {activeTab === "rewards" && (
          <div className="text-sm text-muted-foreground">
            Rewards accrue every second based on the EIP-9000 CHONK9K specification
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export default ChonkNFTStakingDemo;
