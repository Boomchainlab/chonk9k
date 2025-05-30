import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckCircle2, XCircle, ArrowRight, Lock, Shield, Clock } from 'lucide-react';
import { Transaction as TransactionType } from './Block';

interface TransactionProps {
  data: TransactionType;
  status?: 'pending' | 'confirmed' | 'failed';
  highlighted?: boolean;
  showSignature?: boolean;
  className?: string;
  onClick?: () => void;
}

const Transaction: React.FC<TransactionProps> = ({
  data,
  status = 'confirmed',
  highlighted = false,
  showSignature = false,
  className = '',
  onClick
}) => {
  const [showFullAddress, setShowFullAddress] = useState(false);
  
  // Truncate address for display
  const formatAddress = (address: string): string => {
    if (showFullAddress) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  // Format time
  const formatTime = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString();
  };
  
  // Format date
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString();
  };
  
  // Get badge based on status
  const getStatusBadge = () => {
    switch (status) {
      case 'confirmed':
        return (
          <Badge variant="outline" className="bg-green-500/20 text-green-400 text-xs">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Confirmed
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-500/20 text-red-400 text-xs">
            <XCircle className="w-3 h-3 mr-1" /> Failed
          </Badge>
        );
      case 'pending':
      default:
        return (
          <Badge variant="outline" className="bg-amber-500/20 text-amber-400 text-xs">
            <Clock className="w-3 h-3 mr-1 animate-pulse" /> Pending
          </Badge>
        );
    }
  };
  
  return (
    <Card 
      className={cn(
        'border relative transition-all duration-300 overflow-hidden',
        status === 'confirmed' ? 'border-green-500/20 bg-green-950/5' : '',
        status === 'pending' ? 'border-amber-500/20 bg-amber-950/5' : '',
        status === 'failed' ? 'border-red-500/20 bg-red-950/5' : '',
        highlighted ? 'ring-2 ring-[#ff00ff] shadow-[0_0_8px_rgba(255,0,255,0.3)]' : '',
        'hover:shadow-md cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {/* Decorative blur effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff00ff]/10 to-[#00e0ff]/10 opacity-30 blur"></div>
      
      <CardContent className="p-3 relative">
        {/* Transaction ID */}
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs font-mono text-gray-400 truncate mr-2">
            ID: {data.id.slice(0, 10)}...
          </div>
          {getStatusBadge()}
        </div>
        
        {/* Amount */}
        <div className="text-xl font-bold text-center mb-3">
          <span className="bg-gradient-to-r from-[#00e0ff] to-emerald-400 bg-clip-text text-transparent">
            {data.amount} CHONK
          </span>
        </div>
        
        {/* From/To addresses */}
        <div className="flex flex-col space-y-1 md:space-y-0 md:flex-row items-center justify-between text-sm mb-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="text-[11px] font-mono px-2 py-1 rounded bg-black/20 truncate max-w-full cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFullAddress(!showFullAddress);
                  }}
                >
                  From: {formatAddress(data.from)}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Click to {showFullAddress ? 'hide' : 'show'} full address</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex-shrink-0 mx-1">
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className="text-[11px] font-mono px-2 py-1 rounded bg-black/20 truncate max-w-full cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFullAddress(!showFullAddress);
                  }}
                >
                  To: {formatAddress(data.to)}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p className="text-xs">Click to {showFullAddress ? 'hide' : 'show'} full address</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Timestamp and security indicators */}
        <div className="flex items-center justify-between text-[10px] text-gray-400 mt-2">
          <div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {formatTime(data.timestamp)}
            </div>
            <div>{formatDate(data.timestamp)}</div>
          </div>
          
          <div className="flex space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Lock className={cn(
                      "w-3 h-3", 
                      data.signature ? "text-green-400" : "text-gray-500"
                    )} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">
                    {data.signature ? "Digitally signed" : "No signature"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Shield className={cn(
                      "w-3 h-3", 
                      status === 'confirmed' ? "text-green-400" : "text-gray-500"
                    )} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p className="text-xs">
                    {status === 'confirmed' ? "Verified on blockchain" : "Awaiting confirmation"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Signature section (conditional) */}
        {showSignature && data.signature && (
          <div className="mt-3 pt-2 border-t border-gray-700/30">
            <div className="text-[10px] text-gray-500 mb-1 flex items-center">
              <Lock className="w-3 h-3 mr-1" /> Signature
            </div>
            <div className="text-[10px] font-mono break-all bg-black/20 p-1 rounded text-gray-400">
              {data.signature}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Transaction;
