import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ChonkTokenLogo from "./ChonkTokenLogo";

// Interface for the API response
interface ClaimResponse {
  success: boolean;
  amount: number;
  message: string;
  newBalance: number;
}

const TokenClaimCard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [lastClaimTime, setLastClaimTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Check claim status when component loads
  useEffect(() => {
    if (user) {
      checkClaimStatus();
      
      // Set up interval to update the countdown timer
      const interval = setInterval(() => {
        setTimeRemaining(prevTime => prevTime && prevTime > 1000 ? prevTime - 1000 : null);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [user]);
  
  // Function to check token claim status
  const checkClaimStatus = async () => {
    if (!user) return;
    
    try {
      const response = await apiRequest<{canClaim: boolean; timeRemaining?: number; nextClaimTime?: string}>('/api/faucet/status', {
        method: 'GET'
      });
      
      if (response.canClaim === false && response.timeRemaining) {
        setTimeRemaining(response.timeRemaining * 60 * 60 * 1000); // Convert hours to milliseconds
        if (response.nextClaimTime) {
          setLastClaimTime(new Date(response.nextClaimTime).getTime() - (24 * 60 * 60 * 1000));
        }
      }
    } catch (error) {
      console.error('Error checking claim status:', error);
    }
  };

  // Claim token mutation
  const claimMutation = useMutation<ClaimResponse>({
    mutationFn: async () => {
      return apiRequest<ClaimResponse>('/api/faucet/claim', {
        method: 'POST',
      });
    },
    onSuccess: (data) => {
      // Update the last claim time
      setLastClaimTime(Date.now());
      // Reset the countdown timer
      setTimeRemaining(24 * 60 * 60 * 1000); // 24 hours in milliseconds
      
      // Invalidate user data to refresh the token balance
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      // Show success toast
      toast({
        title: "Tokens Claimed!",
        description: `Successfully claimed ${data.amount} CHONK9K tokens.`,
        variant: "default",
        duration: 5000,
      });
    },
    onError: (error) => {
      toast({
        title: "Claim Failed",
        description: error instanceof Error ? error.message : "Failed to claim tokens. Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    },
  });

  // Function to handle the token claim button click
  const handleClaimClick = () => {
    if (user) {
      claimMutation.mutate();
    } else {
      toast({
        title: "Authentication Required",
        description: "Please log in to claim CHONK9K tokens.",
        variant: "destructive",
      });
    }
  };

  // Format the remaining time for display
  const formatTimeRemaining = () => {
    if (!timeRemaining) return null;
    
    const hours = Math.floor(timeRemaining / (60 * 60 * 1000));
    const minutes = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-black/60 backdrop-blur-xl rounded-xl border border-[#ff00ff]/30 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-[#ff00ff]/20 to-transparent border-b border-[#ff00ff]/30 pb-3 px-4 pt-4">
        <h3 className="text-lg font-bold text-[#ff00ff] flex items-center">
          <ChonkTokenLogo size={24} useAnimation={false} className="mr-2" />
          CHONK9K Token Faucet
        </h3>
      </div>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-black/30 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center">
              <ChonkTokenLogo size={36} useAnimation={true} className="mr-3" />
              <div>
                <p className="text-gray-400 text-sm">Claim Amount</p>
                <p className="text-xl font-bold text-white">1,000 CHONK9K</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Current Balance</p>
              <p className="text-xl font-bold text-white">
                {user ? `${(user.tokenBalance || 0).toLocaleString()} CHONK9K` : '0 CHONK9K'}
              </p>
            </div>
          </div>
          
          <div className="bg-[#ff00ff]/5 border border-[#ff00ff]/20 rounded-lg p-4">
            <p className="text-gray-300 text-sm mb-2">
              The CHONK9K token faucet allows you to claim 1,000 tokens every 24 hours to explore the platform's features.
            </p>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">
                {timeRemaining ? (
                  <span>Next claim available in: <span className="font-mono text-white">{formatTimeRemaining()}</span></span>
                ) : (
                  <span>Claim once every 24 hours</span>
                )}
              </div>
              <div className="animate-pulse text-yellow-400 text-xs flex items-center">
                <span className="mr-1">⚡</span> Limited Time Offer
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] hover:from-[#ff00ff]/90 hover:to-[#00e0ff]/90 text-white"
            onClick={handleClaimClick}
            disabled={claimMutation.isPending || !!timeRemaining}
          >
            {claimMutation.isPending ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : timeRemaining ? (
              'Claim Again Later'
            ) : (
              'Claim 1,000 CHONK9K Tokens'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenClaimCard;
