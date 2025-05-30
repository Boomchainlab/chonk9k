import { BrowserProvider } from 'ethers';

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (request: { method: string; params?: Array<any> }) => Promise<any>;
      on: (eventName: string, listener: (...args: any[]) => void) => void;
      removeListener: (eventName: string, listener: (...args: any[]) => void) => void;
      networkVersion?: string;
      chainId?: string;
      isConnected: () => boolean;
      selectedAddress?: string;
      _state?: {
        accounts?: string[];
        isConnected?: boolean;
        isUnlocked?: boolean;
      };
    };
  }
}

// For the BrowserProvider in ethers.js v6
declare module 'ethers' {
  interface BrowserProvider {
    listAccounts(): Promise<Array<{address: string}>>;
    getSigner(): Promise<ethers.JsonRpcSigner>;
    send(method: string, params: Array<any>): Promise<any>;
  }
}
