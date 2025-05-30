import axios from 'axios';
import { CONTRACT_ADDRESSES, RPC_URLS } from '@shared/constants';

// Interface for Base transaction 
export interface BaseTransaction {
  blockHash: string;
  blockNumber: string;
  contractAddress: string | null;
  cumulativeGasUsed: string;
  effectiveGasPrice: string;
  from: string;
  gasUsed: string;
  l1Fee?: string;
  l1FeeScalar?: string;
  l1GasPrice?: string;
  l1GasUsed?: string; 
  logs: any[];
  logsBloom: string;
  status: string;
  to: string | null;
  transactionHash: string;
  transactionIndex: string;
  type: string;
  depositNonce?: string;
}

// Interface for parsed/enhanced transaction data
export interface EnhancedBaseTransaction {
  transactionHash: string;
  blockNumber: number;
  blockHash: string;
  from: string;
  to: string | null;
  contractAddress: string | null;
  status: 'success' | 'failed';
  gasUsed: string;
  effectiveGasPrice: string;
  type: 'contract_creation' | 'contract_interaction' | 'token_transfer' | 'deposit' | 'other';
  timestamp?: number;
  value?: string;
  formattedGasUsed?: string;
  formattedGasPrice?: string;
  l1Fee?: string;
}

/**
 * Get recent Base transactions
 * @param limit Number of transactions to retrieve
 * @returns Promise resolving to an array of transactions
 */
export const getBaseTransactions = async (limit: number = 10): Promise<EnhancedBaseTransaction[]> => {
  try {
    // In a production environment, this would use a direct connection to the Base node
    // For the demo, we'll simulate with the transaction data provided
    console.log('Fetching Base transactions...');
    
    // Process the Base transaction from the attached file
    const baseTxs: BaseTransaction[] = [
      {
        "blockHash": "0xe47777b2e059fbd195354fb07cbe92d7b4c961f1020683c34f6edeb480771db1",
        "blockNumber": "0x14ef2b",
        "contractAddress": null,
        "cumulativeGasUsed": "0xfa0d",
        "depositNonce": "0x14ef2a",
        "effectiveGasPrice": "0x0",
        "from": "0xdeaddeaddeaddeaddeaddeaddeaddeaddead0001",
        "gasUsed": "0xfa0d",
        "logs": [],
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "status": "0x1",
        "to": "0x4200000000000000000000000000000000000015",
        "transactionHash": "0x5919e1d8b905ead83ce09eb52ca632998216b784bcc1f549c0ec91fbd1101156",
        "transactionIndex": "0x0",
        "type": "0x7e"
      },
      {
        "blockHash": "0xe47777b2e059fbd195354fb07cbe92d7b4c961f1020683c34f6edeb480771db1",
        "blockNumber": "0x14ef2b",
        "contractAddress": "0x2626664c2603336e57b271c5c0b26f421741e481",
        "cumulativeGasUsed": "0x52806d",
        "effectiveGasPrice": "0x9502f932",
        "from": "0x7ac7499f3754b65cf9089db328ef51151a78ec00",
        "gasUsed": "0x518660",
        "l1Fee": "0xe780df01003bc",
        "l1FeeScalar": "0.684",
        "l1GasPrice": "0x3d0cda2ec",
        "l1GasUsed": "0x58b3c",
        "logs": [],
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "status": "0x1",
        "to": null,
        "transactionHash": "0x7b983c25dbf2e48cf06366ce23a75a9dcf048c1c464a979812bfd5b287b281ed",
        "transactionIndex": "0x1",
        "type": "0x2"
      }
    ];
    
    // Enhance the transactions with more readable information
    const enhancedTxs: EnhancedBaseTransaction[] = baseTxs.map(tx => {
      // Determine transaction type
      let txType: 'contract_creation' | 'contract_interaction' | 'token_transfer' | 'deposit' | 'other' = 'other';
      
      // If to is null, it's a contract creation
      if (tx.to === null && tx.contractAddress) {
        txType = 'contract_creation';
      } 
      // If it's a deposit transaction (Layer 1 to Layer 2)
      else if (tx.type === '0x7e' || tx.depositNonce) {
        txType = 'deposit';
      }
      // If it's interacting with the CHONK9K contract
      else if (tx.to && tx.to.toLowerCase() === CONTRACT_ADDRESSES.BASE.CHONK9K.toLowerCase()) {
        txType = 'token_transfer';
      }
      // Otherwise it's a general contract interaction
      else if (tx.to && tx.to.startsWith('0x42')) {
        txType = 'contract_interaction';
      }
      
      return {
        transactionHash: tx.transactionHash,
        blockNumber: parseInt(tx.blockNumber, 16),
        blockHash: tx.blockHash,
        from: tx.from,
        to: tx.to,
        contractAddress: tx.contractAddress,
        status: tx.status === '0x1' ? 'success' : 'failed',
        gasUsed: tx.gasUsed,
        effectiveGasPrice: tx.effectiveGasPrice,
        type: txType,
        timestamp: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 3600), // Simulated timestamp
        formattedGasUsed: formatGas(tx.gasUsed),
        formattedGasPrice: formatGasPrice(tx.effectiveGasPrice),
        l1Fee: tx.l1Fee ? formatL1Fee(tx.l1Fee) : undefined
      };
    });
    
    return enhancedTxs;
  } catch (error) {
    console.error('Error fetching Base transactions:', error);
    throw error;
  }
};

/**
 * Format gas value from hex
 */
const formatGas = (gasHex: string): string => {
  try {
    const gas = parseInt(gasHex, 16);
    return gas.toLocaleString();
  } catch (e) {
    return '0';
  }
};

/**
 * Format gas price from hex to gwei
 */
const formatGasPrice = (gasPriceHex: string): string => {
  try {
    const gasPrice = parseInt(gasPriceHex, 16) / 1e9; // Convert wei to gwei
    return `${gasPrice.toFixed(2)} Gwei`;
  } catch (e) {
    return '0 Gwei';
  }
};

/**
 * Format L1 fee from hex to ETH
 */
const formatL1Fee = (l1FeeHex: string): string => {
  try {
    const l1Fee = parseInt(l1FeeHex, 16) / 1e18; // Convert wei to ETH
    return `${l1Fee.toFixed(6)} ETH`;
  } catch (e) {
    return '0 ETH';
  }
};
