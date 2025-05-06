import { ethers, ContractTransactionResponse, Provider } from 'ethers';

// ABI for the CHONK9K token contract
const CHONK9K_ABI = [
  // Read-only functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  
  // Writable functions
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// Contract addresses (replace with actual deployed addresses)
const CONTRACT_ADDRESSES = {
  base: {
    mainnet: "0x", // Replace with actual Base mainnet address once deployed
    testnet: "0x" // Replace with actual Base testnet address once deployed
  },
  solana: {
    mainnet: "HMZK29UWMs3UotWymZtpNvuWi1bKLsD13vQQCcG9Bzaa", // Cyber Chonk NFT collection contract address
    testnet: "HMZK29UWMs3UotWymZtpNvuWi1bKLsD13vQQCcG9Bzaa" // Using same address for testnet for now
  }
};

interface TokenInfo {
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
}

interface ChonkTransactionResult {
  success: boolean;
  hash?: string;
  error?: string;
}

interface Web3State {
  account: string;
  connected: boolean;
  chainId: number | null;
  balance: string;
  tokenBalance: string;
  tokenSymbol: string;
  tokenName: string;
  tokenPrice: string;
}

type StateListener = (state: Web3State) => void;

class Web3Service {
  private provider: ethers.Provider | null = null;
  private signer: ethers.Signer | null = null;
  private tokenContract: ethers.Contract | null = null;
  private chainId: number | null = null;
  private listeners: StateListener[] = [];
  private state: Web3State = {
    account: "",
    connected: false,
    chainId: null,
    balance: "0",
    tokenBalance: "0",
    tokenSymbol: "CHONK9K",
    tokenName: "Chonk9k Token",
    tokenPrice: "0.0042"
  };
  
  constructor() {
    this.initializeWeb3();
  }
  
  // Subscribe to state changes
  subscribe(listener: StateListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  // Get current state
  getState(): Web3State {
    return { ...this.state };
  }
  
  // Update state and notify listeners
  private updateState(newState: Partial<Web3State>): void {
    this.state = { ...this.state, ...newState };
    this.notifyListeners();
  }
  
  // Notify all listeners of state change
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
  
  private async initializeWeb3(): Promise<void> {
    if (window.ethereum) {
      try {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        
        // Check if already connected
        const accounts = await this.provider.listAccounts();
        
        if (accounts.length > 0) {
          await this.connect(false); // Connect silently (no prompt)
        }
        
        // Setup event listeners
        window.ethereum.on('accountsChanged', (accounts: string[]) => {
          if (accounts.length === 0) {
            this.disconnect();
          } else {
            this.updateState({ account: accounts[0] });
            this.refreshBalances();
          }
        });
        
        window.ethereum.on('chainChanged', () => {
          window.location.reload();
        });
      } catch (error) {
        console.error("Failed to initialize Web3:", error);
      }
    }
  }
  
  private getContractAddress(): string {
    // Determine which contract address to use based on chain ID
    if (!this.chainId) return "";
    
    // Base Mainnet
    if (this.chainId === 8453) {
      return CONTRACT_ADDRESSES.base.mainnet;
    }
    // Base Testnet (Sepolia)
    else if (this.chainId === 84532) {
      return CONTRACT_ADDRESSES.base.testnet;
    }
    
    return "";
  }
  
  private initializeContract(): void {
    const contractAddress = this.getContractAddress();
    
    if (contractAddress && this.signer) {
      this.tokenContract = new ethers.Contract(
        contractAddress,
        CHONK9K_ABI,
        this.signer
      );
    }
  }
  
  // Connect to wallet
  async connect(showPrompt = true): Promise<void> {
    if (!window.ethereum) {
      throw new Error("No Ethereum wallet found. Please install MetaMask or another wallet.");
    }
    
    try {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access if needed
      let accounts;
      if (showPrompt) {
        accounts = await this.provider.send("eth_requestAccounts", []);
      } else {
        accounts = await this.provider.listAccounts();
      }
      
      if (accounts.length > 0) {
        this.signer = await this.provider.getSigner();
        
        // Get network information
        const network = await this.provider.getNetwork();
        this.chainId = Number(network.chainId);
        
        // Update state
        this.updateState({
          account: accounts[0].address || accounts[0],
          connected: true,
          chainId: this.chainId
        });
        
        // Initialize the contract
        this.initializeContract();
        
        // Refresh balances
        await this.refreshBalances();
      } else {
        throw new Error("No accounts found.");
      }
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  }
  
  // Disconnect wallet
  disconnect(): void {
    this.provider = null;
    this.signer = null;
    this.tokenContract = null;
    this.chainId = null;
    
    this.updateState({
      account: "",
      connected: false,
      chainId: null,
      balance: "0",
      tokenBalance: "0"
    });
  }
  
  // Refresh balances
  async refreshBalances(): Promise<void> {
    if (!this.state.connected || !this.provider || !this.state.account) return;
    
    try {
      // Get ETH balance
      const ethBalance = await this.provider.getBalance(this.state.account);
      const formattedEthBalance = ethers.formatEther(ethBalance);
      
      // Update state with ETH balance
      this.updateState({ balance: formattedEthBalance });
      
      // Get token balance if contract is initialized
      if (this.tokenContract) {
        try {
          const decimals = await this.tokenContract.decimals();
          const tokenBalance = await this.tokenContract.balanceOf(this.state.account);
          const formattedTokenBalance = ethers.formatUnits(tokenBalance, decimals);
          
          this.updateState({ tokenBalance: formattedTokenBalance });
        } catch (error) {
          console.error("Failed to get token balance:", error);
        }
      } else {
        // If we're on the Base network but don't have the contract, try to initialize it
        if (this.chainId === 8453 || this.chainId === 84532) {
          this.initializeContract();
        }
        
        // For demo purposes, set a random token balance
        const randomBalance = (Math.random() * 1000 + 100).toFixed(2);
        this.updateState({ tokenBalance: randomBalance });
      }
    } catch (error) {
      console.error("Failed to refresh balances:", error);
    }
  }
  
  // Switch to Base network
  async switchToBaseNetwork(): Promise<void> {
    if (!window.ethereum || !this.provider) {
      throw new Error("No Ethereum wallet found.");
    }
    
    try {
      // Try to switch to Base network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x2105' }], // Base Mainnet (8453 in hex)
        });
      } catch (error: any) {
        // This error code means the chain hasn't been added to MetaMask
        if (error.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x2105', // Base Mainnet (8453 in hex)
                chainName: 'Base Mainnet',
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://mainnet.base.org'],
                blockExplorerUrls: ['https://basescan.org/'],
              },
            ],
          });
        } else {
          throw error;
        }
      }
      
      // Update chainId after switch
      const network = await this.provider.getNetwork();
      this.chainId = Number(network.chainId);
      this.updateState({ chainId: this.chainId });
      
      // Initialize contract for the new network
      this.initializeContract();
      
      // Refresh balances
      await this.refreshBalances();
    } catch (error) {
      console.error("Failed to switch network:", error);
      throw error;
    }
  }
  
  // Buy CHONK9K tokens
  async buyTokens(amount: string): Promise<ChonkTransactionResult> {
    if (!this.state.connected || !this.provider || !this.signer) {
      return { success: false, error: "Wallet not connected" };
    }
    
    try {
      // For demo purposes, simulate successful purchase
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate transaction delay
      
      // Update token balance (for demo)
      const currentBalance = parseFloat(this.state.tokenBalance);
      const purchaseAmount = parseFloat(amount);
      const newBalance = (currentBalance + purchaseAmount).toFixed(2);
      
      this.updateState({ tokenBalance: newBalance });
      
      return { 
        success: true,
        hash: `0x${Math.random().toString(16).substring(2)}`
      };
    } catch (error: any) {
      console.error("Failed to buy tokens:", error);
      return { 
        success: false,
        error: error.message || "Transaction failed" 
      };
    }
  }
  
  // Sell CHONK9K tokens
  async sellTokens(amount: string): Promise<ChonkTransactionResult> {
    if (!this.state.connected || !this.provider || !this.signer) {
      return { success: false, error: "Wallet not connected" };
    }
    
    const sellAmount = parseFloat(amount);
    const currentBalance = parseFloat(this.state.tokenBalance);
    
    if (sellAmount > currentBalance) {
      return { success: false, error: "Insufficient token balance" };
    }
    
    try {
      // For demo purposes, simulate successful sale
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate transaction delay
      
      // Update token balance (for demo)
      const newBalance = (currentBalance - sellAmount).toFixed(2);
      this.updateState({ tokenBalance: newBalance });
      
      return { 
        success: true,
        hash: `0x${Math.random().toString(16).substring(2)}`
      };
    } catch (error: any) {
      console.error("Failed to sell tokens:", error);
      return { 
        success: false,
        error: error.message || "Transaction failed" 
      };
    }
  }
  
  // Get provider
  getProvider(): Provider | null {
    return this.provider;
  }
}

// Create a singleton instance of the service
const web3Service = new Web3Service();

// Export as default for compatibility with existing code
export default web3Service;

// Also export as named export for future use
export { web3Service };
