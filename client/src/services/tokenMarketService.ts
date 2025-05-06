// Token Market Data Service

// This service provides real-time token market data, audit status, trending metrics, and liquidity information

export interface TokenMarketData {
  price: string;
  priceChange24h: string;
  marketCap: string;
  volume24h: string;
  circulatingSupply: string;
  totalSupply: string;
  lastUpdated: Date;
  liquidity: TokenLiquidity[];
  auditStatus: AuditStatus;
  trending: TrendingStatus;
}

export interface TokenLiquidity {
  platform: string;
  tokenPair: string;
  liquidityUSD: string;
  volume24h: string;
  apr?: string;  // Optional APR percentage
  tvl?: string;  // Optional TVL (Total Value Locked)
}

export interface AuditStatus {
  audited: boolean;
  status: 'passed' | 'pending' | 'failed' | 'none';
  auditor?: string;  // The security firm that conducted the audit
  score?: number;  // The score out of 100
  issueCount?: number;  // Number of issues found
  lastAuditDate?: Date;  // Date of the last audit
  reportUrl?: string;  // URL to the full audit report
}

export interface TrendingStatus {
  overall: number;  // Overall trending score (0-100)
  platforms: {
    name: string;  // Platform name (e.g., "CoinGecko", "CoinMarketCap")
    heatScore?: number;  // Platform-specific heat score (0-100)
    rank?: number;  // Rank on the platform (if applicable)
    trending: boolean;  // Whether the token is trending on this platform
  }[];
}

class TokenMarketService {
  private updateCallbacks: ((data: TokenMarketData) => void)[] = [];
  private updateInterval: NodeJS.Timeout | null = null;
  
  // Initial data with all major exchanges
  private currentData: TokenMarketData = {
    price: "0.12345678",
    priceChange24h: "5.67",
    marketCap: "23450000",
    volume24h: "5600000",
    circulatingSupply: "780000000",
    totalSupply: "1000000000",
    lastUpdated: new Date(),
    liquidity: [
      // Solana DEXes
      {
        platform: "CHONKPUMP 9000",
        tokenPair: "CHONK9K/SOL",
        liquidityUSD: "3200000",
        volume24h: "1450000",
        apr: "94.5"
      },
      {
        platform: "Raydium",
        tokenPair: "CHONK9K/USDC",
        liquidityUSD: "2500000",
        volume24h: "980000",
        apr: "38.5"
      },
      {
        platform: "Jupiter",
        tokenPair: "CHONK9K/SOL",
        liquidityUSD: "1800000",
        volume24h: "750000",
        apr: "24.2"
      },
      {
        platform: "Orca",
        tokenPair: "CHONK9K/USDT",
        liquidityUSD: "950000",
        volume24h: "320000",
        apr: "19.8"
      },
      {
        platform: "Meteora",
        tokenPair: "CHONK9K/USDC",
        liquidityUSD: "680000",
        volume24h: "210000",
        apr: "22.1"
      },
      // Ethereum DEXes
      {
        platform: "Uniswap",
        tokenPair: "CHONK9K/ETH",
        liquidityUSD: "850000",
        volume24h: "290000",
        tvl: "870000"
      },
      {
        platform: "SushiSwap",
        tokenPair: "CHONK9K/USDT",
        liquidityUSD: "510000",
        volume24h: "175000",
        apr: "17.9"
      },
      // BSC DEXes
      {
        platform: "PancakeSwap",
        tokenPair: "CHONK9K/BUSD",
        liquidityUSD: "420000",
        volume24h: "180000",
        apr: "15.3"
      },
      {
        platform: "Biswap",
        tokenPair: "CHONK9K/BNB",
        liquidityUSD: "380000",
        volume24h: "165000",
        apr: "16.2"
      },
      // Base DEX
      {
        platform: "BaseSwap",
        tokenPair: "CHONK9K/USDC",
        liquidityUSD: "350000",
        volume24h: "125000",
        apr: "18.9"
      },
      // CEXes
      {
        platform: "Binance",
        tokenPair: "CHONK9K/USDT",
        liquidityUSD: "3850000",
        volume24h: "2450000"
      },
      {
        platform: "OKX",
        tokenPair: "CHONK9K/USDT",
        liquidityUSD: "1950000",
        volume24h: "895000"
      },
      {
        platform: "Bybit",
        tokenPair: "CHONK9K/USDT",
        liquidityUSD: "1250000",
        volume24h: "625000"
      },
      {
        platform: "Kucoin",
        tokenPair: "CHONK9K/USDT",
        liquidityUSD: "980000",
        volume24h: "435000"
      },
      {
        platform: "Gate.io",
        tokenPair: "CHONK9K/USDT",
        liquidityUSD: "720000",
        volume24h: "315000"
      },
      {
        platform: "MEXC",
        tokenPair: "CHONK9K/USDT",
        liquidityUSD: "690000",
        volume24h: "287000"
      },
      {
        platform: "Bitget",
        tokenPair: "CHONK9K/USDT",
        liquidityUSD: "630000",
        volume24h: "268000"
      }
    ],
    auditStatus: {
      audited: true,
      status: 'passed',
      auditor: "CyberScope",
      score: 92,
      issueCount: 2,
      lastAuditDate: new Date(2025, 3, 15),  // April 15, 2025
      reportUrl: "https://cyberscope.io/audits/chonk9k-token"
    },
    trending: {
      overall: 87,
      platforms: [
        // Tracking sites
        {
          name: "CoinGecko",
          heatScore: 91,
          rank: 3,
          trending: true
        },
        {
          name: "CoinMarketCap",
          heatScore: 85,
          rank: 8,
          trending: true
        },
        {
          name: "DexScreener",
          heatScore: 88,
          rank: 5,
          trending: true
        },
        {
          name: "DexTools",
          heatScore: 82,
          rank: 12,
          trending: true
        },
        {
          name: "Bitverse",
          heatScore: 90,
          rank: 4,
          trending: true
        },
        // Blockchain explorers
        {
          name: "Solscan",
          heatScore: 79,
          trending: true
        },
        {
          name: "Solana FM",
          heatScore: 76,
          trending: true
        },
        {
          name: "Etherscan",
          heatScore: 64,
          trending: false
        },
        {
          name: "BscScan",
          heatScore: 62,
          trending: false
        },
        // DEXes
        {
          name: "CHONKPUMP",
          heatScore: 98,
          rank: 1,
          trending: true
        },
        {
          name: "Raydium",
          heatScore: 88,
          rank: 2,
          trending: true
        },
        {
          name: "Jupiter",
          heatScore: 84,
          rank: 4,
          trending: true
        },
        {
          name: "Uniswap",
          heatScore: 73,
          trending: true
        },
        {
          name: "PancakeSwap",
          heatScore: 68,
          trending: false
        },
        // CEXes
        {
          name: "Binance",
          heatScore: 72,
          trending: false
        },
        {
          name: "OKX",
          heatScore: 77,
          trending: true
        },
        {
          name: "Bybit",
          heatScore: 75,
          trending: true
        },
        {
          name: "KuCoin",
          heatScore: 69,
          trending: false
        }
      ]
    }
  };
  
  // Simulate fetching real-time market data
  private async fetchMarketData(): Promise<TokenMarketData> {
    try {
      // In a real implementation, you would fetch data from an API
      // For now, we'll simulate realistic changes
      
      const priceFluctuation = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.0002);
      const newPrice = Math.max(0.00001, parseFloat(this.currentData.price) + priceFluctuation);
      
      // Calculate percentage change
      const percentChange = (priceFluctuation / parseFloat(this.currentData.price)) * 100;
      const newPercentChange = (parseFloat(this.currentData.priceChange24h) * 0.98) + (percentChange * 0.02);
      
      // Update volume with some fluctuation
      const volumeChange = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 10000);
      const newVolume = Math.max(100000, parseFloat(this.currentData.volume24h) + volumeChange);
      
      // Update market cap based on new price
      const newMarketCap = newPrice * parseFloat(this.currentData.circulatingSupply);
      
      // Update trending scores with some fluctuation
      const updatedPlatforms = this.currentData.trending.platforms.map(platform => ({
        ...platform,
        heatScore: platform.heatScore 
          ? Math.min(100, Math.max(0, platform.heatScore + (Math.random() > 0.7 ? 1 : -1) * (Math.random() * 2)))
          : undefined,
        rank: platform.rank 
          ? Math.max(1, platform.rank + (Math.random() > 0.9 ? (Math.random() > 0.5 ? 1 : -1) : 0))
          : undefined
      }));
      
      // Calculate new overall trending score
      const avgHeatScore = updatedPlatforms
        .filter(p => p.heatScore !== undefined)
        .reduce((sum, p) => sum + (p.heatScore || 0), 0) / 
        updatedPlatforms.filter(p => p.heatScore !== undefined).length;
      
      // Prepare updated data
      const updatedData: TokenMarketData = {
        ...this.currentData,
        price: newPrice.toFixed(8),
        priceChange24h: newPercentChange.toFixed(2),
        marketCap: newMarketCap.toFixed(0),
        volume24h: newVolume.toFixed(0),
        lastUpdated: new Date(),
        trending: {
          overall: avgHeatScore,
          platforms: updatedPlatforms
        },
        // Update liquidity data with some fluctuations
        liquidity: this.currentData.liquidity.map(item => ({
          ...item,
          volume24h: (parseFloat(item.volume24h) + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 5000)).toFixed(0)
        }))
      };

      return updatedData;
    } catch (error) {
      console.error('Error fetching market data:', error);
      return this.currentData;
    }
  }
  
  // Get the current market data
  async getCurrentMarketData(): Promise<TokenMarketData> {
    // In a real app, this would make an initial API call
    // For now, return the simulated data
    return this.currentData;
  }
  
  // Subscribe to real-time market data updates
  subscribeToMarketUpdates(callback: (data: TokenMarketData) => void, interval = 5000): () => void {
    this.updateCallbacks.push(callback);
    
    // If this is the first subscriber, start the update interval
    if (this.updateCallbacks.length === 1) {
      this.updateInterval = setInterval(async () => {
        const updatedData = await this.fetchMarketData();
        this.currentData = updatedData;
        
        // Notify all subscribers
        this.updateCallbacks.forEach(cb => cb(updatedData));
      }, interval);
    }
    
    // Return unsubscribe function
    return () => {
      this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback);
      
      // If no more subscribers, clear the interval
      if (this.updateCallbacks.length === 0 && this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
      }
    };
  }
  
  // Get detailed liquidity information
  async getLiquidityDetails(): Promise<TokenLiquidity[]> {
    return this.currentData.liquidity;
  }
  
  // Get audit status information
  async getAuditStatus(): Promise<AuditStatus> {
    return this.currentData.auditStatus;
  }
  
  // Get trending status information
  async getTrendingStatus(): Promise<TrendingStatus> {
    return this.currentData.trending;
  }
}

const tokenMarketService = new TokenMarketService();
export default tokenMarketService;