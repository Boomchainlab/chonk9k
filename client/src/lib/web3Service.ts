import { ethers } from 'ethers';
import { WEBSITE_URL, CONTRACT_ADDRESS } from './utils';

// ABI for the Chonk9k token contract (simplified ERC20 interface)
const tokenABI = [
  // Read-only functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address owner) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  
  // Authenticated functions
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// Base network configuration
const baseChainId = 8453; // Base mainnet
const baseNetwork = {
  chainId: `0x${baseChainId.toString(16)}`,
  chainName: 'Base Mainnet',
  nativeCurrency: {
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: ['https://mainnet.base.org'],
  blockExplorerUrls: ['https://basescan.org'],
};

interface Web3State {
  provider: ethers.BrowserProvider | null;
  signer: ethers.Signer | null;
  tokenContract: ethers.Contract | null;
  address: string | null;
  chainId: number | null;
  connected: boolean;
  balance: string | null;
  tokenBalance: string | null;
}

// Initial state
const initialState: Web3State = {
  provider: null,
  signer: null,
  tokenContract: null,
  address: null,
  chainId: null,
  connected: false,
  balance: null,
  tokenBalance: null
};

class Web3Service {
  private state: Web3State = { ...initialState };
  private listeners: ((state: Web3State) => void)[] = [];

  // Get current state
  getState(): Web3State {
    return { ...this.state };
  }

  // Subscribe to state changes
  subscribe(listener: (state: Web3State) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Update state and notify listeners
  private setState(newState: Partial<Web3State>) {
    this.state = { ...this.state, ...newState };
    
    // Notify all listeners
    this.listeners.forEach(listener => listener(this.state));
  }

  // Connect to wallet
  async connect(): Promise<boolean> {
    try {
      // Check if ethereum is available
      if (!window.ethereum) {
        throw new Error("No Ethereum wallet detected. Please install MetaMask or another wallet.");
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Create ethers provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = accounts[0];
      
      // Get network information
      const network = await provider.getNetwork();
      const chainId = network.chainId;
      
      // Create contract instance
      const tokenContract = new ethers.Contract(CONTRACT_ADDRESS, tokenABI, signer);
      
      // Get ETH balance
      const balanceWei = await provider.getBalance(address);
      const balance = ethers.formatEther(balanceWei);
      
      // Get token balance
      const tokenBalanceWei = await tokenContract.balanceOf(address);
      const tokenBalance = ethers.formatUnits(tokenBalanceWei, 18); // Assuming 18 decimals
      
      // Update state
      this.setState({
        provider,
        signer,
        tokenContract,
        address,
        chainId: Number(chainId),
        connected: true,
        balance,
        tokenBalance
      });
      
      // Setup event listeners
      this.setupEventListeners();
      
      return true;
    } catch (error) {
      console.error('Connection error:', error);
      
      // Reset state on error
      this.reset();
      
      throw error;
    }
  }
  
  // Switch to Base network
  async switchToBaseNetwork(): Promise<boolean> {
    if (!window.ethereum) return false;
    
    try {
      // Try to switch to the Base network
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: baseNetwork.chainId }],
      });
      
      return true;
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [baseNetwork],
          });
          return true;
        } catch (addError) {
          console.error('Error adding Base network:', addError);
          return false;
        }
      }
      
      console.error('Error switching to Base network:', switchError);
      return false;
    }
  }
  
  // Disconnect wallet
  disconnect(): void {
    this.reset();
  }
  
  // Reset state
  private reset(): void {
    // Remove event listeners if needed
    this.removeEventListeners();
    
    // Reset state to initial values
    this.setState({ ...initialState });
  }
  
  // Setup wallet event listeners
  private setupEventListeners(): void {
    if (!window.ethereum) return;
    
    // Handle account changes
    window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
    
    // Handle chain changes
    window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));
    
    // Handle disconnect
    window.ethereum.on('disconnect', this.handleDisconnect.bind(this));
  }
  
  // Remove wallet event listeners
  private removeEventListeners(): void {
    if (!window.ethereum) return;
    
    window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged.bind(this));
    window.ethereum.removeListener('chainChanged', this.handleChainChanged.bind(this));
    window.ethereum.removeListener('disconnect', this.handleDisconnect.bind(this));
  }
  
  // Handle account changes
  private async handleAccountsChanged(accounts: string[]): Promise<void> {
    if (accounts.length === 0) {
      // User disconnected their wallet
      this.reset();
    } else {
      // User switched accounts
      const address = accounts[0];
      
      if (this.state.provider && this.state.tokenContract) {
        // Get updated balances
        const balanceWei = await this.state.provider.getBalance(address);
        const balance = ethers.formatEther(balanceWei);
        const tokenBalanceWei = await this.state.tokenContract.balanceOf(address);
        const tokenBalance = ethers.formatUnits(tokenBalanceWei, 18);
        
        this.setState({
          address,
          balance,
          tokenBalance
        });
      }
    }
  }
  
  // Handle chain changes
  private async handleChainChanged(chainId: string): Promise<void> {
    // MetaMask recommends reloading the page on chain changes
    window.location.reload();
  }
  
  // Handle disconnect
  private handleDisconnect(): void {
    this.reset();
  }
  
  // Buy tokens
  async buyTokens(amount: string): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!this.state.signer || !this.state.tokenContract || !this.state.address) {
        return { success: false, error: 'Wallet not connected' };
      }
      
      const tokenPriceInEth = ethers.parseEther('0.0001'); // 1 CHONK9K = 0.0001 ETH
      const tokenAmount = ethers.parseEther(amount);
      const ethAmount = tokenAmount * tokenPriceInEth / ethers.parseEther('1');
      
      // In a real implementation, this would call a swap function on the contract
      // For now, we'll simulate the purchase with a direct transfer to a treasury address
      const treasuryAddress = "0xTreasuryAddressHere"; // Replace with actual treasury address
      
      const tx = await this.state.signer.sendTransaction({
        to: treasuryAddress,
        value: ethAmount,
        gasLimit: 100000n
      });
      
      await tx.wait();
      
      // Update token balance after purchase
      if (this.state.tokenContract) {
        const newTokenBalanceWei = await this.state.tokenContract.balanceOf(this.state.address);
        const newTokenBalance = ethers.formatUnits(newTokenBalanceWei, 18);
        
        this.setState({
          tokenBalance: newTokenBalance
        });
      }
      
      return { success: true, txHash: tx.hash };
    } catch (error: any) {
      console.error('Error buying tokens:', error);
      return { success: false, error: error.message || 'Failed to buy tokens' };
    }
  }
  
  // Sell tokens
  async sellTokens(amount: string): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      if (!this.state.signer || !this.state.tokenContract || !this.state.address) {
        return { success: false, error: 'Wallet not connected' };
      }
      
      const amountToSell = ethers.parseEther(amount);
      
      // Check if user has enough tokens
      const tokenBalance = await this.state.tokenContract.balanceOf(this.state.address);
      if (tokenBalance < amountToSell) {
        return { success: false, error: 'Insufficient token balance' };
      }
      
      // In a real implementation, this would call a swap function on the contract
      // For now, we'll simulate the sell with a token transfer
      const treasuryAddress = "0xTreasuryAddressHere"; // Replace with actual treasury address
      
      const tx = await this.state.tokenContract.transfer(treasuryAddress, amountToSell);
      await tx.wait();
      
      // Update token balance after sale
      const newTokenBalanceWei = await this.state.tokenContract.balanceOf(this.state.address);
      const newTokenBalance = ethers.formatUnits(newTokenBalanceWei, 18);
      
      this.setState({
        tokenBalance: newTokenBalance
      });
      
      return { success: true, txHash: tx.hash };
    } catch (error: any) {
      console.error('Error selling tokens:', error);
      return { success: false, error: error.message || 'Failed to sell tokens' };
    }
  }
  
  // Refresh balances
  async refreshBalances(): Promise<void> {
    if (!this.state.provider || !this.state.tokenContract || !this.state.address) return;
    
    try {
      // Get updated ETH balance
      const balanceWei = await this.state.provider.getBalance(this.state.address);
      const balance = ethers.formatEther(balanceWei);
      
      // Get updated token balance
      const tokenBalanceWei = await this.state.tokenContract.balanceOf(this.state.address);
      const tokenBalance = ethers.formatUnits(tokenBalanceWei, 18);
      
      this.setState({
        balance,
        tokenBalance
      });
    } catch (error) {
      console.error('Error refreshing balances:', error);
    }
  }
}

// Create and export a singleton instance
const web3Service = new Web3Service();
export default web3Service;

// Ethereum window type
declare global {
  interface Window {
    ethereum?: any;
  }
}