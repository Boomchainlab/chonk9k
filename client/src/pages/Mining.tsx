import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, ChevronRight, Zap, Power, CheckCircle, XCircle, CoinsIcon, Battery, Award } from 'lucide-react';

interface MiningRig {
  id: number;
  name: string;
  description: string;
  hashRate: number;
  powerConsumption: number;
  price: number;
  isAvailable: boolean;
  imageUrl: string | null;
  sortOrder: number;
}

interface UserMiningRig {
  id: number;
  userId: number;
  rigId: number;
  purchaseDate: string;
  lastRewardDate: string | null;
  totalMined: number;
  isActive: boolean;
  transactionHash: string | null;
  rig: MiningRig;
}

interface MiningReward {
  id: number;
  userId: number;
  userRigId: number;
  amount: number;
  rewardDate: string;
  transactionHash: string | null;
}

export default function Mining() {
  const [activeTab, setActiveTab] = useState('my-rigs');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Mock user ID, in a real app this would come from authentication state
  const userId = 1;
  
  // Get user's mining rigs
  const { data: userRigs, isLoading: isLoadingUserRigs } = useQuery({
    queryKey: ['/api/mining/user-rigs', userId],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/mining/user-rigs?userId=${userId}`);
      const data = await res.json();
      return data as UserMiningRig[];
    },
  });
  
  // Get available mining rigs to purchase
  const { data: availableRigs, isLoading: isLoadingRigs } = useQuery({
    queryKey: ['/api/mining/rigs', true],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/mining/rigs?available=true');
      const data = await res.json();
      return data as MiningRig[];
    },
  });
  
  // Get mining rewards
  const { data: miningRewards, isLoading: isLoadingRewards } = useQuery({
    queryKey: ['/api/mining/rewards', userId],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/mining/rewards?userId=${userId}`);
      const data = await res.json();
      return data as MiningReward[];
    },
  });
  
  // Purchase a mining rig
  const purchaseMutation = useMutation({
    mutationFn: async (rigId: number) => {
      const res = await apiRequest('POST', '/api/mining/purchase', { userId, rigId });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Mining Rig Purchased',
        description: 'Your new mining rig has been added to your account!',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/mining/user-rigs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] }); // Update user's token balance
    },
    onError: (error: any) => {
      toast({
        title: 'Purchase Failed',
        description: error.message || 'Failed to purchase mining rig',
        variant: 'destructive',
      });
    },
  });
  
  // Claim mining rewards
  const claimRewardsMutation = useMutation({
    mutationFn: async (userRigId: number) => {
      const res = await apiRequest('POST', `/api/mining/claim/${userRigId}`);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: 'Rewards Claimed',
        description: `You've claimed ${data.reward.amount.toFixed(2)} Chonk9k tokens!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/mining/user-rigs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/mining/rewards'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user'] }); // Update user's token balance
    },
    onError: (error: any) => {
      toast({
        title: 'Claim Failed',
        description: error.message || 'Failed to claim mining rewards',
        variant: 'destructive',
      });
    },
  });
  
  // Toggle mining rig status (active/inactive)
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ userRigId, isActive }: { userRigId: number; isActive: boolean }) => {
      const res = await apiRequest('POST', `/api/mining/rigs/${userRigId}/status`, { isActive });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: data.success ? 'Status Updated' : 'Update Failed',
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/mining/user-rigs'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update mining rig status',
        variant: 'destructive',
      });
    },
  });
  
  // Calculate time until next claim for a specific rig
  const calculateTimeUntilNextClaim = (lastRewardDate: string | null): string => {
    if (!lastRewardDate) return 'Ready to claim!';
    
    const lastClaim = new Date(lastRewardDate);
    const now = new Date();
    const hoursSinceLastClaim = Math.floor((now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60));
    
    if (hoursSinceLastClaim >= 1) {
      return 'Ready to claim!';
    } else {
      const minutesRemaining = 60 - Math.floor((now.getTime() - lastClaim.getTime()) / (1000 * 60)) % 60;
      return `${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}`;
    }
  };
  
  // Handler for purchasing a mining rig
  const handlePurchase = (rigId: number) => {
    purchaseMutation.mutate(rigId);
  };
  
  // Handler for claiming mining rewards
  const handleClaimRewards = (userRigId: number) => {
    claimRewardsMutation.mutate(userRigId);
  };
  
  // Handler for toggling mining rig status
  const handleToggleStatus = (userRigId: number, currentStatus: boolean) => {
    toggleStatusMutation.mutate({ userRigId, isActive: !currentStatus });
  };
  
  // Format numbers with commas
  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Chonk9k Mining Center</h1>
          <p className="text-muted-foreground">
            Mine Chonk9k tokens by purchasing and operating virtual mining rigs
          </p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-rigs">My Mining Rigs</TabsTrigger>
          <TabsTrigger value="shop">Mining Shop</TabsTrigger>
          <TabsTrigger value="rewards">Reward History</TabsTrigger>
        </TabsList>
        
        {/* My Mining Rigs Tab */}
        <TabsContent value="my-rigs" className="space-y-4 mt-4">
          {isLoadingUserRigs ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : userRigs && userRigs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userRigs.map((userRig) => (
                <Card key={userRig.id} className={userRig.isActive ? 'border-green-500' : 'border-gray-300 opacity-80'}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>{userRig.rig.name}</span>
                      <Badge variant={userRig.isActive ? 'default' : 'outline'}>
                        {userRig.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{userRig.rig.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Hash Rate</p>
                        <p className="text-lg font-medium flex items-center">
                          <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                          {formatNumber(userRig.rig.hashRate)} H/s
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Power Usage</p>
                        <p className="text-lg font-medium flex items-center">
                          <Power className="w-4 h-4 mr-1 text-red-500" />
                          {formatNumber(userRig.rig.powerConsumption)} W
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Total Mined</p>
                        <p className="text-sm font-medium">{userRig.totalMined.toFixed(6)} Chonk9k</p>
                      </div>
                      <Progress value={Math.min(userRig.totalMined / 100 * 100, 100)} className="h-2" />
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Next Reward</p>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <p className="text-sm">{calculateTimeUntilNextClaim(userRig.lastRewardDate)}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant={userRig.isActive ? "outline" : "default"}
                      onClick={() => handleToggleStatus(userRig.id, userRig.isActive)}
                    >
                      {userRig.isActive ? 
                        <><XCircle className="w-4 h-4 mr-2" /> Stop Mining</> : 
                        <><CheckCircle className="w-4 h-4 mr-2" /> Start Mining</>}
                    </Button>
                    <Button 
                      onClick={() => handleClaimRewards(userRig.id)}
                      disabled={userRig.lastRewardDate && calculateTimeUntilNextClaim(userRig.lastRewardDate) !== 'Ready to claim!'}
                      className="ml-2"
                    >
                      <CoinsIcon className="w-4 h-4 mr-2" /> Claim Rewards
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Battery className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Mining Rigs Yet</h3>
              <p className="text-muted-foreground mb-4">Purchase your first mining rig to start earning Chonk9k tokens!</p>
              <Button onClick={() => setActiveTab('shop')}>
                Browse Mining Shop <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </TabsContent>
        
        {/* Mining Shop Tab */}
        <TabsContent value="shop" className="space-y-4 mt-4">
          {isLoadingRigs ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : availableRigs && availableRigs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableRigs.map((rig) => (
                <Card key={rig.id}>
                  <CardHeader>
                    <CardTitle>{rig.name}</CardTitle>
                    <CardDescription>{rig.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Hash Rate</p>
                        <p className="text-lg font-medium flex items-center">
                          <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                          {formatNumber(rig.hashRate)} H/s
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Power Usage</p>
                        <p className="text-lg font-medium flex items-center">
                          <Power className="w-4 h-4 mr-1 text-red-500" />
                          {formatNumber(rig.powerConsumption)} W
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Efficiency Ratio</p>
                      <p className="text-lg font-medium">
                        {(rig.hashRate / rig.powerConsumption).toFixed(2)} H/W
                      </p>
                    </div>
                    
                    <Alert>
                      <Award className="w-4 h-4" />
                      <AlertTitle>Expected Daily Earnings</AlertTitle>
                      <AlertDescription>
                        Approximately {(rig.hashRate * 0.00001 * 24).toFixed(4)} Chonk9k per day
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => handlePurchase(rig.id)}
                      disabled={purchaseMutation.isPending}
                    >
                      {purchaseMutation.isPending ? 'Processing...' : `Purchase for ${formatNumber(rig.price)} Chonk9k`}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-xl font-medium mb-2">No Mining Rigs Available</h3>
              <p className="text-muted-foreground">Check back later for new mining equipment!</p>
            </div>
          )}
        </TabsContent>
        
        {/* Reward History Tab */}
        <TabsContent value="rewards" className="space-y-4 mt-4">
          {isLoadingRewards ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : miningRewards && miningRewards.length > 0 ? (
            <div className="rounded-md border">
              <div className="p-4 bg-muted/50 flex items-center font-medium">
                <div className="flex-1">Date</div>
                <div className="flex-1">Amount</div>
                <div className="flex-1">Status</div>
              </div>
              <Separator />
              {miningRewards.map((reward) => (
                <React.Fragment key={reward.id}>
                  <div className="p-4 flex items-center">
                    <div className="flex-1">{new Date(reward.rewardDate).toLocaleDateString()}</div>
                    <div className="flex-1 font-medium">{reward.amount.toFixed(6)} Chonk9k</div>
                    <div className="flex-1">
                      <Badge variant="secondary">Claimed</Badge>
                    </div>
                  </div>
                  <Separator />
                </React.Fragment>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CoinsIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Rewards Yet</h3>
              <p className="text-muted-foreground mb-4">Start mining with your rigs to earn Chonk9k rewards!</p>
              <Button onClick={() => setActiveTab('my-rigs')}>
                Go to My Rigs <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
