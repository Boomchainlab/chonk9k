import React from 'react';

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
        src="/images/chonk9k-logo.jpeg" 
        alt="CHONK 9000 Token" 
        width={size} 
        height={size}
        className="rounded-full object-cover"
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