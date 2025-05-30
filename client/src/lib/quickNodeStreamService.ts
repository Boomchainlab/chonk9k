import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

export interface StreamConfig {
  name: string;
  network: string;
  dataset: string;
  filter_function: string;
  region: string;
  start_range: number;
  end_range: number;
  dataset_batch_size: number;
  include_stream_metadata: string;
  destination: string;
  fix_block_reorgs: number;
  keep_distance_from_tip: number;
  destination_attributes: {
    url: string;
    compression: string;
    headers: Record<string, string>;
    max_retry: number;
    retry_interval_sec: number;
    post_timeout_sec: number;
  };
  status: 'active' | 'paused';
}

const QUICKNODE_API_URL = 'https://api.quicknode.com/streams/rest/v1/streams';

// This service integrates with QuickNode's blockchain streaming API
// for more responsive and real-time blockchain monitoring
export const quickNodeStreamService = {
  // Check if the QuickNode API key is available
  isConfigured: () => {
    return !!import.meta.env.VITE_QUICKNODE_API_KEY;
  },

  // Create a new stream with QuickNode
  createStream: async (config: StreamConfig) => {
    try {
      if (!quickNodeStreamService.isConfigured()) {
        throw new Error('QuickNode API key is not configured');
      }

      const response = await axios.post(QUICKNODE_API_URL, config, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'QN_API_KEY': import.meta.env.VITE_QUICKNODE_API_KEY
        }
      });

      return response.data;
    } catch (error) {
      console.error('Failed to create QuickNode stream:', error);
      throw error;
    }
  },

  // List all streams
  listStreams: async () => {
    try {
      if (!quickNodeStreamService.isConfigured()) {
        throw new Error('QuickNode API key is not configured');
      }

      const response = await axios.get(QUICKNODE_API_URL, {
        headers: {
          'accept': 'application/json',
          'QN_API_KEY': import.meta.env.VITE_QUICKNODE_API_KEY
        }
      });

      return response.data;
    } catch (error) {
      console.error('Failed to list QuickNode streams:', error);
      throw error;
    }
  },

  // Get a specific stream by ID
  getStream: async (streamId: string) => {
    try {
      if (!quickNodeStreamService.isConfigured()) {
        throw new Error('QuickNode API key is not configured');
      }

      const response = await axios.get(`${QUICKNODE_API_URL}/${streamId}`, {
        headers: {
          'accept': 'application/json',
          'QN_API_KEY': import.meta.env.VITE_QUICKNODE_API_KEY
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Failed to get QuickNode stream ${streamId}:`, error);
      throw error;
    }
  },

  // Update an existing stream
  updateStream: async (streamId: string, config: Partial<StreamConfig>) => {
    try {
      if (!quickNodeStreamService.isConfigured()) {
        throw new Error('QuickNode API key is not configured');
      }

      const response = await axios.patch(`${QUICKNODE_API_URL}/${streamId}`, config, {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'QN_API_KEY': import.meta.env.VITE_QUICKNODE_API_KEY
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Failed to update QuickNode stream ${streamId}:`, error);
      throw error;
    }
  },

  // Delete a stream
  deleteStream: async (streamId: string) => {
    try {
      if (!quickNodeStreamService.isConfigured()) {
        throw new Error('QuickNode API key is not configured');
      }

      const response = await axios.delete(`${QUICKNODE_API_URL}/${streamId}`, {
        headers: {
          'accept': 'application/json',
          'QN_API_KEY': import.meta.env.VITE_QUICKNODE_API_KEY
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Failed to delete QuickNode stream ${streamId}:`, error);
      throw error;
    }
  },

  // Helper function to create a basic Ethereum block monitoring stream
  createEthereumBlockMonitor: async (webhookUrl: string, name = 'CHONK9K Block Monitor') => {
    // This filter function extracts only the relevant block data we need
    const filterFunction = `function main(data) {
      var numberDecimal = parseInt(data.streamData.number, 16);
      var filteredData = {
        hash: data.streamData.hash,
        number: numberDecimal,
        timestamp: new Date().toISOString(),
        tokenSymbol: 'CHONK9K'
      };
      return filteredData;
    }`;

    // Base64 encode the filter function
    const encodedFunction = btoa(filterFunction);

    const config: StreamConfig = {
      name,
      network: 'ethereum-mainnet',
      dataset: 'block',
      filter_function: encodedFunction,
      region: 'usa_east',
      start_range: 0, // Start from the current block
      end_range: 0,   // No end range (keep monitoring)
      dataset_batch_size: 1,
      include_stream_metadata: 'body',
      destination: 'webhook',
      fix_block_reorgs: 0,
      keep_distance_from_tip: 0,
      destination_attributes: {
        url: webhookUrl,
        compression: 'none',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_QUICKNODE_API_KEY}`
        },
        max_retry: 3,
        retry_interval_sec: 1,
        post_timeout_sec: 10
      },
      status: 'active'
    };

    return quickNodeStreamService.createStream(config);
  },

  // Helper function to create a Solana block monitoring stream
  createSolanaBlockMonitor: async (webhookUrl: string, name = 'CHONK9K Solana Monitor') => {
    // This filter function extracts only the relevant Solana block data
    const filterFunction = `function main(data) {
      var blockData = {
        slot: data.streamData.slot,
        blockHeight: data.streamData.blockHeight,
        blockTime: new Date(data.streamData.blockTime * 1000).toISOString(),
        tokenSymbol: 'CHONK9K',
        network: 'solana-mainnet'
      };
      return blockData;
    }`;

    // Base64 encode the filter function
    const encodedFunction = btoa(filterFunction);

    const config: StreamConfig = {
      name,
      network: 'solana-mainnet',
      dataset: 'block',
      filter_function: encodedFunction,
      region: 'usa_east',
      start_range: 0,
      end_range: 0,
      dataset_batch_size: 1,
      include_stream_metadata: 'body',
      destination: 'webhook',
      fix_block_reorgs: 0,
      keep_distance_from_tip: 0,
      destination_attributes: {
        url: webhookUrl,
        compression: 'none',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_QUICKNODE_API_KEY}`
        },
        max_retry: 3,
        retry_interval_sec: 1,
        post_timeout_sec: 10
      },
      status: 'active'
    };

    return quickNodeStreamService.createStream(config);
  }
};

export default quickNodeStreamService;
