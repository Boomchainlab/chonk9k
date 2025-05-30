import React, { useState } from 'react';

const WalletAddressInput: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isValidAddress, setIsValidAddress] = useState(true);
  const [selectedNetwork, setSelectedNetwork] = useState<'solana' | 'ethereum' | 'bsc' | 'base'>('solana');

  const sanitizeAddress = (input: string, network: string): string => {
    const trimmed = input.trim();
    if (network === 'solana') {
      return trimmed.replace(/[^1-9A-HJ-NP-Za-km-z]/g, '').slice(0, 44);
    } else {
      return trimmed.replace(/[^0-9a-fA-Fx]/g, '').slice(0, 42);
    }
  };

  const isValidWalletAddress = (address: string, network: string): boolean => {
    if (!address) return false;
    switch (network) {
      case 'solana':
        return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
      case 'ethereum':
      case 'bsc':
      case 'base':
        return /^0x[a-fA-F0-9]{40}$/.test(address);
      default:
        return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = e.target.value;
    const sanitized = sanitizeAddress(rawInput, selectedNetwork);
    setWalletAddress(sanitized);
    setIsValidAddress(isValidWalletAddress(sanitized, selectedNetwork));
  };

  return (
    <div className="w-full max-w-md">
      <label className="text-sm font-medium text-white mb-1 block">Wallet Address</label>
      <input
        type="text"
        value={walletAddress}
        onChange={handleChange}
        placeholder="Enter wallet address"
        className={`w-full px-4 py-2 rounded bg-black/50 text-white placeholder:text-gray-500 border transition duration-200 ${
          isValidAddress ? 'border-gray-700 focus:border-green-500' : 'border-red-500 focus:border-red-500'
        }`}
      />
      {!isValidAddress && (
        <p className="text-red-400 text-sm mt-1">
          Invalid wallet address format for <span className="font-semibold">{selectedNetwork}</span>.
        </p>
      )}

      <div className="mt-3">
        <label className="text-sm font-medium text-white">Select Network:</label>
        <select
          className="mt-1 px-3 py-2 rounded bg-black/50 text-white border border-gray-700"
          value={selectedNetwork}
          onChange={(e) => setSelectedNetwork(e.target.value as any)}
        >
          <option value="solana">Solana</option>
          <option value="ethereum">Ethereum</option>
          <option value="bsc">BSC</option>
          <option value="base">Base</option>
        </select>
      </div>
    </div>
  );
};

export default WalletAddressInput;
