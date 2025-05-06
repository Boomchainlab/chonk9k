import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, ExternalLink, Copy, Check, Cpu, Box, ShieldCheck } from 'lucide-react';
import { AuditStatus } from '@/services/tokenMarketService';
import { CONTRACT_ADDRESSES } from '@shared/constants';

interface TokenContractsDisplayProps {
  auditStatus: AuditStatus;
  className?: string;
}

const TokenContractsDisplay: React.FC<TokenContractsDisplayProps> = ({ 
  auditStatus,
  className = ''
}) => {
  const [copiedContract, setCopiedContract] = React.useState<string | null>(null);
  
  // Sample contract addresses
  const contracts = [
    {
      network: 'Solana',
      address: CONTRACT_ADDRESSES.SOLANA_TOKEN || '1oki9enw51rGYSEHRRQ71ybavr6wKJiikZc1PVgq3S2',
      explorerUrl: 'https://solscan.io/token/1oki9enw51rGYSEHRRQ71ybavr6wKJiikZc1PVgq3S2',
      isPrimary: true,
      icon: '/images/networks/solana.svg'
    },
    {
      network: 'Ethereum',
      address: CONTRACT_ADDRESSES.ETH_TOKEN || '0x3A7e2eECf7338A98bB21b696D8EeF3224344fd33',
      explorerUrl: 'https://etherscan.io/token/0x3A7e2eECf7338A98bB21b696D8EeF3224344fd33',
      isPrimary: false,
      icon: '/images/networks/ethereum.svg'
    },
    {
      network: 'BSC',
      address: CONTRACT_ADDRESSES.BSC_TOKEN || '0xbB5577CdDEF1c33E43B2e288Ff36D525335F9F12',
      explorerUrl: 'https://bscscan.com/token/0xbB5577CdDEF1c33E43B2e288Ff36D525335F9F12',
      isPrimary: false,
      icon: '/images/networks/bsc.svg'
    },
    {
      network: 'Base',
      address: CONTRACT_ADDRESSES.BASE_TOKEN || '0x1Fc8C34687969aDa3Cb977E9359e66798fa1A6A3',
      explorerUrl: 'https://basescan.org/token/0x1Fc8C34687969aDa3Cb977E9359e66798fa1A6A3',
      isPrimary: false,
      icon: '/images/networks/base.svg'
    }
  ];
  
  const handleCopyContract = (address: string) => {
    navigator.clipboard.writeText(address)
      .then(() => {
        setCopiedContract(address);
        setTimeout(() => setCopiedContract(null), 2000);
      })
      .catch(err => console.error('Could not copy contract address:', err));
  };
  
  const truncateAddress = (address: string, start = 6, end = 4) => {
    if (!address) return '';
    if (address.length <= start + end) return address;
    return `${address.slice(0, start)}...${address.slice(-end)}`;
  };
  
  return (
    <Card className={`bg-black/60 backdrop-blur-xl rounded-xl border border-[#ff00ff]/30 shadow-lg overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-[#ff00ff]/20 to-transparent border-b border-[#ff00ff]/30 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white flex items-center">
            <Code className="mr-2 h-5 w-5 text-[#ff00ff]" />
            Smart Contracts
          </CardTitle>
          {auditStatus.audited && (
            <Badge 
              variant="outline" 
              className={`bg-green-500/20 text-green-300 border-green-500/50 flex items-center`}
            >
              <ShieldCheck className="h-3 w-3 mr-1" />
              Audited
            </Badge>
          )}
        </div>
        <CardDescription className="text-gray-400">
          CHONK9K token contracts across blockchains
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {contracts.map((contract, index) => (
          <div 
            key={index} 
            className={`bg-black/30 p-3 rounded-lg border ${contract.isPrimary ? 'border-[#00e0ff]/40' : 'border-gray-800'} hover:border-[#00e0ff]/30 transition-colors`}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <img 
                  src={contract.icon} 
                  alt={contract.network}
                  className="w-6 h-6 mr-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/networks/default.svg';
                  }}
                />
                <div>
                  <div className="text-white flex items-center">
                    {contract.network}
                    {contract.isPrimary && (
                      <Badge className="ml-2 bg-[#ff00ff]/20 text-[#ff00ff] border-[#ff00ff]/40 text-xs">
                        Primary
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => handleCopyContract(contract.address)}
                  className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
                  title="Copy address"
                >
                  {copiedContract === contract.address ? (
                    <Check className="h-4 w-4 text-green-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                
                <a 
                  href={contract.explorerUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors"
                  title="View on explorer"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="text-sm font-mono break-all text-gray-300 mt-1">
              {truncateAddress(contract.address, 10, 6)}
            </div>
            
            {contract.isPrimary && auditStatus.audited && (
              <div className="mt-2 text-xs flex items-center bg-green-500/10 text-green-300 p-1.5 rounded-md">
                <ShieldCheck className="h-3 w-3 mr-1" />
                Audited by {auditStatus.auditor} with {auditStatus.score}/100 score
              </div>
            )}
          </div>
        ))}
        
        {/* Contract Deployment Info */}
        <div className="mt-4 p-3 bg-black/40 rounded-lg border border-gray-800">
          <div className="flex items-center mb-2">
            <Cpu className="h-4 w-4 mr-2 text-[#00e0ff]" />
            <h4 className="text-white">Contract Deployment Info</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-gray-400">Token Type</div>
              <div className="text-sm text-white">SPL Token (Solana)</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Deployed On</div>
              <div className="text-sm text-white">Apr 2, 2025</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Mintable</div>
              <div className="text-sm text-white">No</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Burnable</div>
              <div className="text-sm text-white">Yes</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenContractsDisplay;