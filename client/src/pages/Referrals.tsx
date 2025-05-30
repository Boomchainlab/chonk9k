import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Progress } from "@/components/ui/progress";
import { formatNumber } from "@/lib/utils";
import { ClipboardCopy, Copy, Check, User, Gift, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ReferralUser {
  id: number;
  username: string;
  tokenBalance: number;
  walletAddress: string;
  createdAt: string;
}

interface ReferralReward {
  id: number;
  referrerId: number;
  referredId: number;
  amount: number;
  status: string;
  transactionHash?: string;
  createdAt: string;
  referred?: ReferralUser;
}

interface ReferralStats {
  totalReferrals: number;
  totalRewards: number;
  pendingRewards: number;
  referralCode: string;
  referralLink: string;
  rewardsPercentage: number;
  nextTier: {
    name: string;
    rewardsPercentage: number;
    remainingReferrals: number;
  } | null;
}

export default function Referrals() {
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Fetch referral stats
  const { data: referralStats, isLoading: isLoadingStats, refetch: refetchStats } = useQuery<ReferralStats>({ 
    queryKey: ["/api/referrals/stats"],
    throwOnError: true
  });

  // Fetch referral rewards
  const { data: referralRewards = [], isLoading: isLoadingRewards, refetch: refetchRewards } = useQuery<ReferralReward[]>({ 
    queryKey: ["/api/referrals/rewards"],
    throwOnError: true
  });

  // Join with referral code mutation
  const joinMutation = useMutation({
    mutationFn: async (code: string) => {
      return apiRequest("/api/referrals/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode: code })
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "You've successfully joined using a referral code!",
      });
      setReferralCode('');
      refetchStats();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Join",
        description: error.message || "Invalid referral code. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Generate referral code mutation (if user doesn't have one yet)
  const generateCodeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/referrals/generate-code", {
        method: "POST"
      });
    },
    onSuccess: () => {
      toast({
        title: "Referral Code Generated",
        description: "Your unique referral code has been generated!",
      });
      refetchStats();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Generate Code",
        description: error.message || "There was an error generating your referral code.",
        variant: "destructive"
      });
    }
  });

  // Claim rewards mutation
  const claimRewardsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/referrals/claim-rewards", {
        method: "POST"
      });
    },
    onSuccess: () => {
      toast({
        title: "Rewards Claimed",
        description: "Your referral rewards have been successfully claimed!",
      });
      refetchStats();
      refetchRewards();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Claim Rewards",
        description: error.message || "There was an error claiming your rewards.",
        variant: "destructive"
      });
    }
  });

  const handleCopyLink = () => {
    if (referralStats?.referralLink) {
      navigator.clipboard.writeText(referralStats.referralLink);
      setCopied(true);
      toast({
        title: "Link Copied",
        description: "Referral link copied to clipboard!",
      });
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleJoinReferral = () => {
    if (!referralCode.trim()) {
      toast({
        title: "Empty Code",
        description: "Please enter a referral code.",
        variant: "destructive"
      });
      return;
    }
    
    joinMutation.mutate(referralCode.trim());
  };

  const handleGenerateCode = () => {
    generateCodeMutation.mutate();
  };

  const handleClaimRewards = () => {
    if (referralStats && referralStats.pendingRewards <= 0) {
      toast({
        title: "No Rewards",
        description: "You don't have any pending rewards to claim.",
        variant: "destructive"
      });
      return;
    }
    
    claimRewardsMutation.mutate();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Referral Program</h1>
        <p className="text-lg text-muted-foreground">Invite friends and earn CHONK9K rewards when they join</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Referral Stats */}
        <div className="lg:col-span-2">
          {isLoadingStats ? (
            <Card>
              <CardContent className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : referralStats ? (
            <Card>
              <CardHeader>
                <CardTitle>Your Referral Stats</CardTitle>
                <CardDescription>Track your referral performance and earnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Total Referrals</div>
                    <div className="text-3xl font-bold">{referralStats.totalReferrals}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Total Rewards Earned</div>
                    <div className="text-3xl font-bold">{formatNumber(referralStats.totalRewards)} CHONK9K</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Pending Rewards</div>
                    <div className="text-3xl font-bold">{formatNumber(referralStats.pendingRewards)} CHONK9K</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 justify-between items-center">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Your Referral Code</div>
                      <div className="text-xl font-semibold">{referralStats.referralCode}</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopyLink}>
                        {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                        Copy Link
                      </Button>
                      
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={handleClaimRewards} 
                        disabled={claimRewardsMutation.isPending || referralStats.pendingRewards <= 0}
                      >
                        {claimRewardsMutation.isPending ? (
                          <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Claiming...</>
                        ) : (
                          <><Gift className="h-4 w-4 mr-1" /> Claim Rewards</>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {referralStats.nextTier && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          Current Reward Rate: <span className="font-medium">{referralStats.rewardsPercentage}%</span>
                        </span>
                        <span>
                          Next Tier: <span className="font-medium">{referralStats.nextTier.name} ({referralStats.nextTier.rewardsPercentage}%)</span>
                        </span>
                      </div>
                      <Progress value={referralStats.totalReferrals / (referralStats.totalReferrals + referralStats.nextTier.remainingReferrals) * 100} />
                      <div className="text-xs text-muted-foreground text-right">
                        {referralStats.nextTier.remainingReferrals} more referrals needed for next tier
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Join the Referral Program</CardTitle>
                <CardDescription>Generate your referral code to start earning rewards</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-6">
                <User className="h-16 w-16 mx-auto mb-4 text-primary/20" />
                <p className="mb-6">You don't have a referral code yet. Generate one to start earning rewards when friends join using your link!</p>
                <Button 
                  onClick={handleGenerateCode} 
                  disabled={generateCodeMutation.isPending}
                >
                  {generateCodeMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Generating...</>
                  ) : (
                    'Generate Referral Code'
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Join with Referral */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Join with Referral</CardTitle>
              <CardDescription>Enter a friend's referral code</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Enter referral code"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Enter a friend's referral code to earn bonus tokens and help them earn rewards.
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleJoinReferral}
                disabled={joinMutation.isPending || !referralCode.trim()}
              >
                {joinMutation.isPending ? (
                  <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Joining...</>
                ) : (
                  'Join with Referral'
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/20 rounded-full p-2 mt-0.5">
                    <span className="font-bold text-primary">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Generate Your Code</h4>
                    <p className="text-sm text-muted-foreground">Create your unique referral code to share with friends</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/20 rounded-full p-2 mt-0.5">
                    <span className="font-bold text-primary">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Invite Friends</h4>
                    <p className="text-sm text-muted-foreground">Share your code or referral link with friends</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-primary/20 rounded-full p-2 mt-0.5">
                    <span className="font-bold text-primary">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Earn Rewards</h4>
                    <p className="text-sm text-muted-foreground">Get {referralStats?.rewardsPercentage || 3}% of their token purchases as CHONK9K rewards</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Referral History */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Referral History</h2>
        {isLoadingRewards ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : referralRewards.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reward Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referralRewards.map((reward) => (
                  <TableRow key={reward.id}>
                    <TableCell className="font-medium">{reward.referred?.username || `User #${reward.referredId}`}</TableCell>
                    <TableCell>{formatDate(reward.createdAt)}</TableCell>
                    <TableCell>{formatNumber(reward.amount)} CHONK9K</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${reward.status === 'claimed' ? 'bg-green-100 text-green-800' : reward.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                        {reward.status.charAt(0).toUpperCase() + reward.status.slice(1)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-lg mb-2">No referral history yet</p>
              <p className="text-muted-foreground">Start sharing your referral code to earn rewards!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
