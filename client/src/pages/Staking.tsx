import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import web3Service from "@/lib/web3Service";
import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface StakingPool {
  id: number;
  name: string;
  description: string;
  apr: number;
  minStakeAmount: number;
  lockPeriodDays: number;
  totalStaked: number;
  maxCapacity?: number;
  isActive: boolean;
}

interface UserStake {
  id: number;
  poolId: number;
  amount: number;
  startDate: string;
  endDate: string;
  claimedRewards: number;
  isActive: boolean;
  lastClaimDate?: string;
  transactionHash?: string;
  pool?: StakingPool;
}

export default function Staking() {
  const [stakeAmount, setStakeAmount] = useState<string>('');
  const [selectedPoolId, setSelectedPoolId] = useState<number | null>(null);
  const [isStaking, setIsStaking] = useState(false);
  const { toast } = useToast();

  // Fetch staking pools
  const { data: stakingPools = [], isLoading: isLoadingPools } = useQuery({ 
    queryKey: ["/api/staking/pools"],
    throwOnError: true
  });

  // Fetch user stakes
  const { data: userStakes = [], isLoading: isLoadingStakes, refetch: refetchUserStakes } = useQuery({ 
    queryKey: ["/api/staking/user-stakes"],
    throwOnError: true
  });

  // Calculate total rewards earned
  const totalRewardsEarned = userStakes.reduce((total: number, stake: UserStake) => {
    return total + stake.claimedRewards;
  }, 0);

  // Calculate total staked
  const totalUserStaked = userStakes.reduce((total: number, stake: UserStake) => {
    return stake.isActive ? total + stake.amount : total;
  }, 0);

  // Stake tokens mutation
  const stakeMutation = useMutation({
    mutationFn: async (data: { poolId: number, amount: number }) => {
      return apiRequest("/api/staking/stake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Tokens Staked Successfully",
        description: `You have successfully staked ${stakeAmount} CHONK9K tokens!`,
      });
      setStakeAmount('');
      setSelectedPoolId(null);
      refetchUserStakes();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Stake Tokens",
        description: error.message || "There was an error staking your tokens.",
        variant: "destructive"
      });
    }
  });

  // Claim rewards mutation
  const claimMutation = useMutation({
    mutationFn: async (stakeId: number) => {
      return apiRequest(`/api/staking/claim/${stakeId}`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      toast({
        title: "Rewards Claimed Successfully",
        description: "Your staking rewards have been claimed and added to your wallet!",
      });
      refetchUserStakes();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Claim Rewards",
        description: error.message || "There was an error claiming your rewards.",
        variant: "destructive"
      });
    }
  });

  // Unstake tokens mutation
  const unstakeMutation = useMutation({
    mutationFn: async (stakeId: number) => {
      return apiRequest(`/api/staking/unstake/${stakeId}`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      toast({
        title: "Tokens Unstaked Successfully",
        description: "Your tokens have been successfully unstaked and returned to your wallet!",
      });
      refetchUserStakes();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Unstake Tokens",
        description: error.message || "There was an error unstaking your tokens.",
        variant: "destructive"
      });
    }
  });

  const handleConnectWallet = async () => {
    setIsStaking(true);
    try {
      const isConnected = await web3Service.connect();
      if (!isConnected) {
        throw new Error("Failed to connect wallet");
      }

      // Check if we're on Base network
      const state = web3Service.getState();
      if (state.chainId !== 8453) { // Base mainnet
        const switched = await web3Service.switchToBaseNetwork();
        if (!switched) {
          throw new Error("Please switch to Base network to stake tokens");
        }
      }

      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Wallet Connection Failed",
        description: error.message || "Failed to connect your wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsStaking(false);
    }
  };

  const handleStake = async () => {
    if (!selectedPoolId) {
      toast({
        title: "No Pool Selected",
        description: "Please select a staking pool first.",
        variant: "destructive"
      });
      return;
    }

    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to stake.",
        variant: "destructive"
      });
      return;
    }

    const pool = stakingPools.find((p: StakingPool) => p.id === selectedPoolId);
    if (!pool) return;

    if (parseFloat(stakeAmount) < pool.minStakeAmount) {
      toast({
        title: "Below Minimum Stake",
        description: `The minimum stake amount for this pool is ${pool.minStakeAmount} CHONK9K.`,
        variant: "destructive"
      });
      return;
    }

    const state = web3Service.getState();
    if (!state.connected) {
      await handleConnectWallet();
      if (!web3Service.getState().connected) return;
    }

    stakeMutation.mutate({
      poolId: selectedPoolId,
      amount: parseFloat(stakeAmount)
    });
  };

  const handleClaim = (stakeId: number) => {
    claimMutation.mutate(stakeId);
  };

  const handleUnstake = (stakeId: number) => {
    unstakeMutation.mutate(stakeId);
  };

  // Calculate time remaining for lock period
  const calculateTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    
    if (diffTime <= 0) return "Unlocked";
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return `${diffDays}d ${diffHours}h remaining`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Stake CHONK9K</h1>
      <p className="text-center text-lg mb-8">Stake your tokens to earn rewards and support the $CHONK9K ecosystem</p>
      
      {/* Staking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Staked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(totalUserStaked)} CHONK9K</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Rewards Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatNumber(totalRewardsEarned)} CHONK9K</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Stakes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userStakes.filter((s: UserStake) => s.isActive).length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Staking Pools Section */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Staking Pools</h2>
          {isLoadingPools ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {stakingPools.map((pool: StakingPool) => (
                <Card key={pool.id} className={`${selectedPoolId === pool.id ? 'ring-2 ring-primary' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>{pool.name}</CardTitle>
                      <Badge variant={pool.isActive ? "default" : "secondary"}>
                        {pool.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardDescription>{pool.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">APR</div>
                        <div className="text-lg font-bold">{pool.apr}%</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Lock Period</div>
                        <div className="text-lg font-bold">{pool.lockPeriodDays} days</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Min Stake</div>
                        <div className="text-lg font-bold">{formatNumber(pool.minStakeAmount)} CHONK9K</div>
                      </div>
                    </div>
                    
                    {pool.maxCapacity && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Pool Capacity</span>
                          <span>{formatNumber(pool.totalStaked)} / {formatNumber(pool.maxCapacity)} CHONK9K</span>
                        </div>
                        <Progress value={(pool.totalStaked / pool.maxCapacity) * 100} />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => setSelectedPoolId(pool.id)}
                      disabled={!pool.isActive}
                    >
                      Select Pool
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Staking Form Section */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Stake Your Tokens</CardTitle>
              <CardDescription>
                {selectedPoolId ? (
                  `You're staking in ${stakingPools.find((p: StakingPool) => p.id === selectedPoolId)?.name}`
                ) : (
                  "Select a pool from the left to begin staking"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Stake Amount</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      disabled={!selectedPoolId}
                      className="pr-20"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-sm">
                      CHONK9K
                    </div>
                  </div>
                </div>
                
                {selectedPoolId && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Lock Period</span>
                      <span>{stakingPools.find((p: StakingPool) => p.id === selectedPoolId)?.lockPeriodDays} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated APR</span>
                      <span>{stakingPools.find((p: StakingPool) => p.id === selectedPoolId)?.apr}%</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Estimated Rewards</span>
                      <span>
                        {stakeAmount ? formatNumber(
                          parseFloat(stakeAmount) * 
                          (stakingPools.find((p: StakingPool) => p.id === selectedPoolId)?.apr || 0) / 100 * 
                          (stakingPools.find((p: StakingPool) => p.id === selectedPoolId)?.lockPeriodDays || 0) / 365
                        ) : '0'} CHONK9K
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button 
                className="w-full" 
                onClick={handleStake}
                disabled={!selectedPoolId || stakeMutation.isPending || !stakeAmount || parseFloat(stakeAmount) <= 0}
              >
                {stakeMutation.isPending ? (
                  <span className="flex items-center gap-1">
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-1"></div>
                    Staking...
                  </span>
                ) : 'Stake Tokens'}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleConnectWallet}
                disabled={isStaking}
              >
                {isStaking ? (
                  <span className="flex items-center gap-1">
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-1"></div>
                    Connecting...
                  </span>
                ) : 'Connect Wallet'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* User Stakes Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Your Stakes</h2>
        {isLoadingStakes ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : userStakes.length > 0 ? (
          <div className="space-y-4">
            {userStakes.map((stake: UserStake) => (
              <Card key={stake.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>{stake.pool?.name || `Pool #${stake.poolId}`}</CardTitle>
                    <Badge variant={stake.isActive ? "default" : "secondary"}>
                      {stake.isActive ? "Active" : "Ended"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Staked Amount</div>
                      <div className="text-lg font-bold">{formatNumber(stake.amount)} CHONK9K</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Claimed Rewards</div>
                      <div className="text-lg font-bold">{formatNumber(stake.claimedRewards)} CHONK9K</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Start Date</div>
                      <div className="text-lg font-bold">{new Date(stake.startDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Lock Status</div>
                      <div className="text-lg font-bold">{calculateTimeRemaining(stake.endDate)}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2">
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleClaim(stake.id)}
                    disabled={claimMutation.isPending || !stake.isActive}
                  >
                    {claimMutation.isPending ? 'Claiming...' : 'Claim Rewards'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleUnstake(stake.id)}
                    disabled={unstakeMutation.isPending || !stake.isActive || new Date(stake.endDate) > new Date()}
                  >
                    {unstakeMutation.isPending ? 'Unstaking...' : 'Unstake'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-lg">You don't have any active stakes.</p>
              <p className="text-muted-foreground">Select a pool and stake your CHONK9K tokens to start earning rewards!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
