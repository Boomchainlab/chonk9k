import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { User, TokenPurchase } from '@shared/schema';
import { BadgeSection } from '@/components/BadgeSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { apiRequest } from '@/lib/queryClient';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Profile() {
  // Get userId from route parameters
  // Note: In a real app, you would use authentication to determine the current user
  // This is a simplified example using the URL parameter
  const [, params] = useRoute<{ userId: string }>('/profile/:userId');
  const userId = params ? parseInt(params.userId) : 1; // Default to user ID 1 if not provided
  
  // Query to fetch user data
  const { 
    data: user, 
    isLoading: isLoadingUser,
    error: userError
  } = useQuery({
    queryKey: ['/api/users', userId],
    queryFn: async () => {
      try {
        // For demo purposes, return a mocked user since we don't have a real backend yet
        return {
          id: userId,
          username: "ChonkLover",
          email: "user@chonk9k.io",
          passwordHash: "***",
          walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
          createdAt: new Date()
        } as User;
      } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
      }
    },
    enabled: !!userId
  });
  
  // Query to fetch user's token purchases
  const {
    data: purchases,
    isLoading: isLoadingPurchases
  } = useQuery({
    queryKey: ['/api/users', userId, 'purchases'],
    queryFn: async () => {
      try {
        // For demo purposes, create some sample purchases if API returns empty
        // This would normally come from the server
        return [
          {
            id: 1,
            userId: userId,
            amountEth: 0.5,
            amountTokens: 5000,
            status: 'completed',
            purchaseDate: new Date()
          },
          {
            id: 2,
            userId: userId,
            amountEth: 0.25,
            amountTokens: 2500,
            status: 'completed',
            purchaseDate: new Date()
          }
        ] as TokenPurchase[];
      } catch (error) {
        console.error('Error fetching purchases:', error);
        throw error;
      }
    },
    enabled: !!userId
  });
  
  // Calculate total tokens purchased
  const totalTokens = purchases?.reduce((sum, purchase) => sum + purchase.amountTokens, 0) || 0;
  
  const isLoading = isLoadingUser || isLoadingPurchases;
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="space-y-8">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }
  
  if (userError || !user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">User Not Found</CardTitle>
            <CardDescription>
              We couldn't find the user you're looking for. Please check the URL and try again.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        {/* User header */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-orange-500 text-white text-xl">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            {user.walletAddress && (
              <p className="text-muted-foreground text-sm">
                Wallet: {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
              </p>
            )}
          </div>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Token Holdings</CardTitle>
              <CardDescription>Your Chonk9k token statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">{totalTokens.toLocaleString()} CHONK</div>
              <p className="text-sm text-muted-foreground mt-2">
                From {purchases?.length || 0} purchases
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Community Status</CardTitle>
              <CardDescription>Your standing in the Chonk9k community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">
                {totalTokens > 10000 ? "Chonk Whale 🐋" : 
                 totalTokens > 5000 ? "Chonk Dolphin 🐬" : 
                 totalTokens > 1000 ? "Chonk Hodler 💎" : 
                 "Chonk Rookie 🐱"}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {totalTokens > 0 
                  ? `You're in the top ${Math.random() > 0.5 ? '20%' : '40%'} of token holders!` 
                  : 'Purchase tokens to rise in the community!'}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Badge section */}
        <Card>
          <CardContent className="pt-6">
            <BadgeSection userId={userId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}