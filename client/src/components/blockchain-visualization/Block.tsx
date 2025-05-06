import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, CheckCircle2, XCircle, Hash, Clock, Database } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  timestamp: number;
  signature?: string;
}

export interface BlockData {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  nonce: number;
  previousHash: string;
  hash: string;
  miner?: string;
  difficulty?: number;
  status?: 'valid' | 'invalid' | 'mining' | 'pending';
}

interface BlockProps {
  data: BlockData;
  isGenesis?: boolean;
  className?: string;
  onClick?: () => void;
  onTransactionClick?: (tx: Transaction) => void;
  highlighted?: boolean;
  expanded?: boolean;
  animateEntry?: boolean;
}

const Block: React.FC<BlockProps> = ({
  data,
  isGenesis = false,
  className = '',
  onClick,
  onTransactionClick,
  highlighted = false,
  expanded = false,
  animateEntry = false
}) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isMining, setIsMining] = useState(data.status === 'mining');
  const [showFullHash, setShowFullHash] = useState(false);
  
  // Animation states
  const [visible, setVisible] = useState(!animateEntry);
  
  useEffect(() => {
    if (animateEntry) {
      const timer = setTimeout(() => setVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, [animateEntry]);
  
  useEffect(() => {
    // Determine validity based on status or actual hash verification
    if (data.status === 'valid') {
      setIsValid(true);
    } else if (data.status === 'invalid') {
      setIsValid(false);
    } else {
      // In a real implementation, we would verify the hash here
      setIsValid(data.hash.startsWith('0'.repeat(data.difficulty || 2)));
    }
    
    setIsMining(data.status === 'mining');
  }, [data]);
  
  // Format timestamp to readable date/time
  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };
  
  // Truncate hash for display
  const truncateHash = (hash: string): string => {
    if (showFullHash) return hash;
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
  };
  
  // Get status badge
  const getStatusBadge = () => {
    if (isMining) {
      return <Badge variant="outline" className="bg-amber-600/20 text-amber-500 animate-pulse">Mining</Badge>;
    }
    
    if (isValid === true) {
      return <Badge variant="outline" className="bg-green-600/20 text-green-500">Valid</Badge>;
    }
    
    if (isValid === false) {
      return <Badge variant="outline" className="bg-red-600/20 text-red-500">Invalid</Badge>;
    }
    
    return <Badge variant="outline" className="bg-gray-500/20">Pending</Badge>;
  };
  
  return (
    <Card 
      className={cn(
        'border-2 transition-all duration-500 hover:shadow-md',
        isGenesis ? 'border-purple-500/50 bg-purple-950/10' : '',
        isMining ? 'border-amber-500/50 bg-amber-950/10 animate-pulse' : '',
        isValid === false ? 'border-red-500/50 bg-red-950/10' : '',
        isValid === true && !isGenesis ? 'border-green-500/50 bg-green-950/10' : '',
        highlighted ? 'ring-2 ring-[#ff00ff] shadow-[0_0_10px_rgba(255,0,255,0.5)]' : '',
        !visible ? 'opacity-0 transform translate-y-10' : 'opacity-100 transform translate-y-0',
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold flex items-center space-x-2">
            <span className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] bg-clip-text text-transparent">
              {isGenesis ? 'Genesis Block' : `Block #${data.index}`}
            </span>
            {getStatusBadge()}
          </CardTitle>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="p-1 cursor-help">
                  <Info className="h-4 w-4 text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nonce: {data.nonce}</p>
                <p>Difficulty: {data.difficulty || 2}</p>
                {data.miner && <p>Miner: {data.miner}</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <CardDescription className="flex items-center space-x-2 text-xs">
          <Clock className="h-3 w-3" />
          <span>{formatTimestamp(data.timestamp)}</span>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        {isMining ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Hash className="h-3 w-3" /> Block Hash
              </div>
              <div 
                className={cn(
                  'text-xs font-mono p-1.5 rounded bg-black/30 break-all cursor-pointer',
                  isValid === false ? 'text-red-400' : 'text-green-400'
                )}
                onClick={() => setShowFullHash(!showFullHash)}
              >
                {truncateHash(data.hash)}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Hash className="h-3 w-3" /> Previous Hash
              </div>
              <div 
                className="text-xs font-mono p-1.5 rounded bg-black/30 break-all cursor-pointer text-blue-400"
                onClick={() => setShowFullHash(!showFullHash)}
              >
                {truncateHash(data.previousHash)}
              </div>
            </div>
            
            {expanded && (
              <div className="mt-3 space-y-1">
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Database className="h-3 w-3" /> Transactions ({data.transactions.length})
                </div>
                {data.transactions.length > 0 ? (
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {data.transactions.map((tx) => (
                      <div 
                        key={tx.id}
                        className="text-xs p-1.5 rounded bg-black/20 hover:bg-black/30 cursor-pointer transition-colors"
                        onClick={() => onTransactionClick && onTransactionClick(tx)}
                      >
                        <div className="flex justify-between">
                          <span className="text-gray-400">ID: {tx.id.slice(0, 8)}...</span>
                          <span className="text-emerald-400">{tx.amount} CHONK</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                          <span>From: {tx.from.slice(0, 6)}...</span>
                          <span>To: {tx.to.slice(0, 6)}...</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 italic">No transactions</div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between">
        <div className="flex items-center text-xs text-gray-500">
          {isValid === true ? (
            <CheckCircle2 className="h-3 w-3 text-green-500 mr-1" />
          ) : isValid === false ? (
            <XCircle className="h-3 w-3 text-red-500 mr-1" />
          ) : null}
          {expanded ? 
            <span>{data.transactions.length} transaction{data.transactions.length !== 1 ? 's' : ''}</span> :
            <span>{isValid === true ? 'Verified' : isValid === false ? 'Invalid' : 'Pending verification'}</span>
          }
        </div>
      </CardFooter>
    </Card>
  );
};

export default Block;
