import React from 'react';
import LivePrice from './LivePrice';
import ChonkTokenLogo from './ChonkTokenLogo';

interface LivePriceHeaderProps {
  className?: string;
}

const LivePriceHeader: React.FC<LivePriceHeaderProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center py-1 px-3 rounded-full bg-black/30 backdrop-blur-md border border-[#ff00ff]/20 ${className}`}>
      <ChonkTokenLogo size={24} useAnimation={false} />
      <div className="ml-2">
        <LivePrice showCard={false} size="sm" />
      </div>
    </div>
  );
};

export default LivePriceHeader;
