import axios from 'axios';

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
const BASE_URL = 'https://pro-api.coinmarketcap.com/v1';

// Type definitions for CoinMarketCap API responses
export interface CMCQuote {
  price: number;
  volume_24h: number;
  volume_change_24h: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
  market_cap_dominance: number;
  fully_diluted_market_cap: number;
}

export interface CMCCurrency {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  cmc_rank: number;
  num_market_pairs: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  infinite_supply: boolean;
  last_updated: string;
  date_added: string;
  tags: string[];
  quote: {
    [currency: string]: CMCQuote;
  };
}

export interface CMCExchange {
  id: number;
  name: string;
  slug: string;
  is_active: number;
  status: string;
  first_historical_data: string;
  last_historical_data: string;
}

// Create axios instance with default headers
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
    'Accept': 'application/json',
  }
});

// Service functions for CMC API
export const coinMarketCapService = {
  // Get latest crypto listings with market data
  getLatestListings: async (limit: number = 100, convert: string = 'USD') => {
    try {
      const response = await api.get('/cryptocurrency/listings/latest', {
        params: {
          limit,
          convert
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching latest listings from CoinMarketCap:', error);
      throw error;
    }
  },

  // Search for specific cryptocurrency
  searchCryptocurrency: async (query: string, convert: string = 'USD') => {
    try {
      const response = await api.get('/cryptocurrency/quotes/latest', {
        params: {
          symbol: query,
          convert
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching for cryptocurrency ${query}:`, error);
      throw error;
    }
  },

  // Get list of exchanges
  getExchanges: async (limit: number = 100) => {
    try {
      const response = await api.get('/exchange/map', {
        params: {
          limit,
          listing_status: 'active'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching exchanges from CoinMarketCap:', error);
      throw error;
    }
  },

  // Get market pairs for a specific cryptocurrency
  getMarketPairs: async (symbol: string, limit: number = 100) => {
    try {
      const response = await api.get('/cryptocurrency/market-pairs/latest', {
        params: {
          symbol,
          limit
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching market pairs for ${symbol}:`, error);
      throw error;
    }
  }
};