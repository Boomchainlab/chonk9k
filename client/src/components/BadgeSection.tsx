import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge as BadgeType, UserBadge } from '@shared/schema';
import { BadgeGrid } from './BadgeGrid';
import { apiRequest } from '@/lib/queryClient';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface BadgeSectionProps {
  userId: number;
}

export function BadgeSection({ userId }: BadgeSectionProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('earned');
  
  // Query to fetch all badges
  const { 
    data: allBadges, 
    isLoading: isLoadingBadges 
  } = useQuery({
    queryKey: ['/api/badges'],
    queryFn: async () => {
      // For demo purposes, return some mock badges
      return [
        {
          id: 1,
          name: "Early Adopter",
          description: "One of the first to join the Chonk9k community",
          imageUrl: "https://cryptologos.cc/logos/chonk-chonk-logo.svg",
          requirement: "token_purchase",
          requirementValue: 1000,
          category: "holder",
          rarity: "uncommon",
          createdAt: new Date()
        },
        {
          id: 2,
          name: "Diamond Hands",
          description: "Held $CHONK tokens for more than 30 days",
          imageUrl: "https://cryptologos.cc/logos/maker-mkr-logo.svg",
          requirement: "hodl_duration",
          requirementValue: 30,
          category: "holder",
          rarity: "rare",
          createdAt: new Date()
        },
        {
          id: 3,
          name: "Crypto Whale",
          description: "Purchased more than 10,000 $CHONK tokens",
          imageUrl: "https://cryptologos.cc/logos/whale-whale-logo.svg",
          requirement: "token_purchase",
          requirementValue: 10000,
          category: "holder",
          rarity: "epic",
          createdAt: new Date()
        },
        {
          id: 4,
          name: "Meme Master",
          description: "Created and shared 10+ Chonk9k memes in the community",
          imageUrl: "https://cryptologos.cc/logos/dogelon-mars-elon-logo.svg",
          requirement: "community_engagement",
          requirementValue: 10,
          category: "community",
          rarity: "uncommon",
          createdAt: new Date()
        },
        {
          id: 5,
          name: "Launch Party",
          description: "Participated in the IDO launch event",
          imageUrl: "https://cryptologos.cc/logos/pancakeswap-cake-logo.svg",
          requirement: "special_event",
          requirementValue: 1,
          category: "special",
          rarity: "legendary",
          createdAt: new Date()
        }
      ] as BadgeType[];
    }
  });
  
  // Query to fetch user badges
  const { 
    data: userBadges, 
    isLoading: isLoadingUserBadges 
  } = useQuery({
    queryKey: ['/api/users', userId, 'badges'],
    queryFn: async () => {
      // For demo purposes, the user has earned two badges
      return [
        {
          id: 1,
          userId: userId,
          badgeId: 1,
          earnedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          displayed: true,
          badge: {
            id: 1,
            name: "Early Adopter",
            description: "One of the first to join the Chonk9k community",
            imageUrl: "https://cryptologos.cc/logos/chonk-chonk-logo.svg",
            requirement: "token_purchase",
            requirementValue: 1000,
            category: "holder",
            rarity: "uncommon",
            createdAt: new Date()
          }
        }
      ] as (UserBadge & { badge: BadgeType })[];
    },
    enabled: !!userId
  });
  
  // Query to check for eligible badges
  const { 
    data: eligibleBadges, 
    isLoading: isLoadingEligibleBadges,
    refetch: refetchEligibleBadges
  } = useQuery({
    queryKey: ['/api/users', userId, 'eligible-badges'],
    queryFn: async () => {
      // For demo purposes, user is eligible for one badge (based on their token purchases)
      return [
        {
          id: 3,
          name: "Crypto Whale",
          description: "Purchased more than 10,000 $CHONK tokens",
          imageUrl: "https://cryptologos.cc/logos/whale-whale-logo.svg",
          requirement: "token_purchase",
          requirementValue: 10000,
          category: "holder",
          rarity: "epic",
          createdAt: new Date()
        }
      ] as BadgeType[];
    },
    enabled: !!userId
  });
  
  // Mutation to claim eligible badges
  const claimBadgesMutation = useMutation({
    mutationFn: async () => {
      try {
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        };
        const url = `/api/users/${userId}/award-eligible-badges`;
        const response = await fetch(url, requestOptions);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error in claim badges mutation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate the relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'badges'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'eligible-badges'] });
      
      toast({
        title: 'Badges Claimed!',
        description: 'You have successfully claimed your new badges.',
      });
    },
    onError: (error) => {
      console.error('Error claiming badges:', error);
      toast({
        title: 'Failed to claim badges',
        description: 'There was an error claiming your badges. Please try again.',
        variant: 'destructive'
      });
    }
  });
  
  // Create a set of earned badge IDs for filtering
  const earnedBadgeIds = new Set(userBadges?.map(ub => ub.badgeId) || []);
  
  // Extract actual badge objects from user badges
  const earnedBadgeObjects = userBadges?.map(ub => ub.badge) || [];
  
  // Filter available badges (all badges that aren't earned)
  const availableBadges = allBadges?.filter(badge => !earnedBadgeIds.has(badge.id)) || [];
  
  const hasEligibleBadges = (eligibleBadges && eligibleBadges.length > 0) || false;
  
  const isLoading = isLoadingBadges || isLoadingUserBadges || isLoadingEligibleBadges;
  const isClaimingBadges = claimBadgesMutation.isPending;
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Community Badges</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="h-4 w-16 mt-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Community Badges</h2>
        {hasEligibleBadges && (
          <Button
            onClick={() => claimBadgesMutation.mutate()}
            disabled={isClaimingBadges}
          >
            {isClaimingBadges ? 'Claiming...' : 'Claim New Badges'}
          </Button>
        )}
      </div>
      
      {hasEligibleBadges && (
        <Alert className="bg-amber-100 border-amber-300">
          <AlertTitle className="text-amber-800">You have new badges!</AlertTitle>
          <AlertDescription className="text-amber-700">
            You've unlocked {eligibleBadges!.length} new badge{eligibleBadges!.length !== 1 ? 's' : ''}. 
            Click the "Claim New Badges" button to add them to your collection.
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="earned">
            Earned Badges ({earnedBadgeObjects.length})
          </TabsTrigger>
          <TabsTrigger value="available">
            Available Badges ({availableBadges.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="earned" className="pt-4">
          {earnedBadgeObjects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>You haven't earned any badges yet.</p>
              <p className="text-sm mt-2">Participate in token events to earn your first badge!</p>
            </div>
          ) : (
            <BadgeGrid badges={earnedBadgeObjects} />
          )}
        </TabsContent>
        
        <TabsContent value="available" className="pt-4">
          {availableBadges.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>You've collected all available badges!</p>
              <p className="text-sm mt-2">Check back later for new badges.</p>
            </div>
          ) : (
            <BadgeGrid badges={availableBadges} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}