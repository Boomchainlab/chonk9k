import { useState, useEffect, useCallback } from 'react';
import { web3Service } from '../lib/web3Service';
import { useToast } from './use-toast';

export function useWeb3() {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [state, setState] = useState(web3Service.getState());

  // Subscribe to web3Service state changes
  useEffect(() => {
    const unsubscribe = web3Service.subscribe(newState => {
      setState(newState);
    });
    
    return () => unsubscribe();
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    
    try {
      await web3Service.connect();
      
      toast({
        title: 'Wallet Connected',
        description: 'Your wallet has been connected successfully.',
      });
      
      // Check if we're on the Base network
      const currentState = web3Service.getState();
      if (currentState.chainId !== 8453) {
        toast({
          title: 'Network Switch Required',
          description: 'Please switch to the Base network to interact with Chonk9k.',
          variant: 'destructive',
        });
        
        await web3Service.switchToBaseNetwork();
      }
    } catch (error: any) {
      toast({
        title: 'Connection Failed',
        description: error.message || 'Failed to connect wallet.',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  }, [toast, isConnecting]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    web3Service.disconnect();
    
    toast({
      title: 'Wallet Disconnected',
      description: 'Your wallet has been disconnected.',
    });
  }, [toast]);

  // Buy tokens
  const buyTokens = useCallback(async (amount: string) => {
    if (isProcessing) return null;
    if (!state.connected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet first.',
        variant: 'destructive',
      });
      return null;
    }
    
    setIsProcessing(true);
    
    try {
      const result = await web3Service.buyTokens(amount);
      
      if (result.success) {
        toast({
          title: 'Purchase Successful',
          description: `You've successfully purchased ${amount} CHONK9K tokens.`,
        });
        
        // Refresh balances
        await web3Service.refreshBalances();
        
        return result;
      } else {
        toast({
          title: 'Purchase Failed',
          description: result.error || 'Failed to purchase tokens.',
          variant: 'destructive',
        });
        return result;
      }
    } catch (error: any) {
      toast({
        title: 'Purchase Failed',
        description: error.message || 'Failed to purchase tokens.',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setIsProcessing(false);
    }
  }, [toast, isProcessing, state.connected]);

  // Sell tokens
  const sellTokens = useCallback(async (amount: string) => {
    if (isProcessing) return null;
    if (!state.connected) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet first.',
        variant: 'destructive',
      });
      return null;
    }
    
    setIsProcessing(true);
    
    try {
      const result = await web3Service.sellTokens(amount);
      
      if (result.success) {
        toast({
          title: 'Sale Successful',
          description: `You've successfully sold ${amount} CHONK9K tokens.`,
        });
        
        // Refresh balances
        await web3Service.refreshBalances();
        
        return result;
      } else {
        toast({
          title: 'Sale Failed',
          description: result.error || 'Failed to sell tokens.',
          variant: 'destructive',
        });
        return result;
      }
    } catch (error: any) {
      toast({
        title: 'Sale Failed',
        description: error.message || 'Failed to sell tokens.',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    } finally {
      setIsProcessing(false);
    }
  }, [toast, isProcessing, state.connected]);

  // Refresh balances
  const refreshBalances = useCallback(async () => {
    if (!state.connected) return;
    await web3Service.refreshBalances();
  }, [state.connected]);

  return {
    ...state,
    isConnecting,
    isProcessing,
    connectWallet,
    disconnectWallet,
    buyTokens,
    sellTokens,
    refreshBalances
  };
}