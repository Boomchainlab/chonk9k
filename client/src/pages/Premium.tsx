import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import web3Service from "@/lib/web3Service";
import { CheckCircle, Clock, AlertCircle, Zap, TrendingUp, Gift, Users, Check, Loader2 } from "lucide-react";
import { formatNumber } from "@/lib/utils";

interface PremiumTier {
  id: number;
  name: string;
  description: string;
  tokenRequirement: number;
  stakingBonus: number;
  referralBonus: number;
  spinMultiplier: number;
}

interface UserPremiumInfo {
  currentTier: number;
  tokenBalance: number;
  nextTierRequirement: number | null;
  upgradeProgress: number;
}

export default function Premium() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // Fetch premium tiers
  const { data: premiumTiers = [], isLoading: isLoadingTiers } = useQuery<PremiumTier[]>({ 
    queryKey: ["/api/premium/tiers"],
    throwOnError: true
  });

  // Fetch user premium info
  const { data: userPremium, isLoading: isLoadingUserInfo } = useQuery<UserPremiumInfo>({ 
    queryKey: ["/api/premium/user-info"],
    throwOnError: true
  });

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      const isConnected = await web3Service.connect();
      if (!isConnected) {
        throw new Error("Failed to connect wallet");
      }

      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully. Now you can buy tokens to upgrade your membership tier.",
      });
    } catch (error: any) {
      toast({
        title: "Wallet Connection Failed",
        description: error.message || "Failed to connect your wallet. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Helper to get current tier information
  const getCurrentTierInfo = () => {
    if (!userPremium || !premiumTiers.length) return null;
    return premiumTiers.find(tier => tier.id === userPremium.currentTier) || premiumTiers[0];
  };

  const currentTier = getCurrentTierInfo();

  // Helper to check if user can upgrade
  const canUpgradeToTier = (tier: PremiumTier) => {
    if (!userPremium) return false;
    return userPremium.tokenBalance >= tier.tokenRequirement;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">Premium Membership</h1>
        <p className="text-lg text-muted-foreground">Unlock exclusive benefits by holding more CHONK9K tokens</p>
      </div>
      
      {/* Current Status */}
      <div className="mb-12">
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="p-8">
            {isLoadingUserInfo ? (
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : userPremium ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-medium mb-2">Your Membership</h2>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{currentTier?.name || 'Standard'}</div>
                      <div className="text-sm text-muted-foreground">Current Membership Level</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Your Token Balance</div>
                      <div className="text-xl font-bold">{formatNumber(userPremium.tokenBalance)} CHONK9K</div>
                    </div>
                    
                    {userPremium.nextTierRequirement && (
                      <div>
                        <div className="text-sm text-muted-foreground">Needed for Next Tier</div>
                        <div className="text-xl font-bold">{formatNumber(userPremium.nextTierRequirement)} CHONK9K</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <h3 className="text-lg font-medium mb-3">Your Benefits</h3>
                  <ul className="space-y-2">
                    {currentTier && (
                      <>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>{currentTier.stakingBonus}% bonus on staking rewards</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>{currentTier.referralBonus}% referral commission</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span>{currentTier.spinMultiplier}x daily spin wheel rewards</span>
                        </li>
                      </>
                    )}
                  </ul>
                  
                  {userPremium.nextTierRequirement && (
                    <div className="mt-6">
                      <Button onClick={handleConnectWallet} disabled={isConnecting}>
                        {isConnecting ? (
                          <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Connecting...</>
                        ) : (
                          'Buy Tokens to Upgrade'
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-primary/50 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Sign in to view your membership status</h3>
                <p className="text-muted-foreground mb-4">Connect your wallet to see your membership tier and benefits</p>
                <Button onClick={handleConnectWallet} disabled={isConnecting}>
                  {isConnecting ? (
                    <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Connecting...</>
                  ) : (
                    'Connect Wallet'
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Premium Tiers */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Membership Tiers</h2>
        
        {isLoadingTiers ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {premiumTiers.map((tier) => {
              const isCurrentTier = userPremium && userPremium.currentTier === tier.id;
              const canUpgrade = canUpgradeToTier(tier);
              
              return (
                <Card key={tier.id} className={`
                  ${isCurrentTier ? 'border-primary border-2' : ''}
                  ${canUpgrade && !isCurrentTier ? 'border-green-400' : ''}
                `}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{tier.name}</CardTitle>
                        <CardDescription>{tier.description}</CardDescription>
                      </div>
                      {isCurrentTier && (
                        <Badge variant="default">Current</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <div className="text-sm text-muted-foreground mb-1">Required Balance</div>
                      <div className="text-3xl font-bold">{formatNumber(tier.tokenRequirement)} CHONK9K</div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary/60" />
                        <span className="text-sm">{tier.stakingBonus}% staking reward bonus</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary/60" />
                        <span className="text-sm">{tier.referralBonus}% referral commission</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-primary/60" />
                        <span className="text-sm">{tier.spinMultiplier}x daily spin rewards</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {isCurrentTier ? (
                      <div className="w-full p-2 bg-primary/10 rounded-md flex justify-center items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span>Active Tier</span>
                      </div>
                    ) : canUpgrade ? (
                      <Button className="w-full" variant="default">
                        Upgrade Now
                      </Button>
                    ) : (
                      <div className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground p-2 bg-background rounded-md">
                        <Clock className="h-4 w-4" />
                        <span>Need {formatNumber(tier.tokenRequirement - (userPremium?.tokenBalance || 0))} more tokens</span>
                      </div>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Benefits Explanation */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Membership Benefits</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>Staking Bonus</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Earn higher APR on your staked CHONK9K tokens. The higher your membership tier, the more
                bonus rewards you'll receive on top of the base staking rate.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span>Referral Commission</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Earn more from your referrals. Premium members get higher commission rates when friends
                join using their referral code or purchase tokens.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5 text-primary" />
                <span>Spin Wheel Multiplier</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Get bigger rewards from the daily spin wheel. Your rewards are multiplied based on your
                membership tier, giving you more chances to win big!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
