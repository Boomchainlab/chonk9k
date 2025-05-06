import React from 'react';

interface ChonkTokenLogoProps {
  size?: number;
  useAnimation?: boolean;
  className?: string;
}

const ChonkTokenLogo: React.FC<ChonkTokenLogoProps> = ({ 
  size = 48, 
  useAnimation = false,
  className = ''
}) => {
  return (
    <div 
      className={`relative ${className} ${useAnimation ? 'animate-pulse' : ''}`}
      style={{ width: size, height: size }}
    >
      <img 
        src="/chonk9k-logo.svg" 
        alt="CHONK9K Token" 
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback to a colored circle with text if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.style.backgroundColor = '#ff00ff';
            parent.style.borderRadius = '50%';
            parent.style.display = 'flex';
            parent.style.alignItems = 'center';
            parent.style.justifyContent = 'center';
            parent.style.color = 'white';
            parent.style.fontWeight = 'bold';
            parent.style.fontSize = `${size / 3}px`;
            parent.textContent = '₵9K';
          }
        }}
      />
      {useAnimation && (
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] opacity-30 animate-ping"
          style={{ animationDuration: '3s' }}
        ></div>
      )}
    </div>
  );
};

export default ChonkTokenLogo;
