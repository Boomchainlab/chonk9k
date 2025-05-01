import React from 'react';
import tokenLogo from '@assets/806ED59A-7B11-4101-953C-13897F5FFD73.jpeg';

interface ChonkTokenLogoProps {
  size?: number;
  className?: string;
  useAnimation?: boolean;
}

const ChonkTokenLogo: React.FC<ChonkTokenLogoProps> = ({ 
  size = 40, 
  className = '',
  useAnimation = true
 }) => {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Using the actual token logo image */}
      <img 
        src={tokenLogo} 
        alt="CHONK 9000 Token" 
        width={size} 
        height={size}
        className="rounded-full object-cover"
        onError={(e) => {
          console.error('Image loading error:', e);
          // Fallback if image fails to load
          const target = e.target as HTMLImageElement;
          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiNmZjAwZmYiLz48dGV4dCB4PSI1MCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5DSE9OSDwvdGV4dD48L3N2Zz4=';
        }}
      />
      
      {/* Animated glow effect - only if animation is enabled */}
      {useAnimation && (
        <div 
          className="absolute inset-0 rounded-full bg-[#ff00ff] opacity-30 blur-xl animate-pulse"
          style={{ animationDuration: '3s' }}
        />
      )}
    </div>
  );
};

export default ChonkTokenLogo;