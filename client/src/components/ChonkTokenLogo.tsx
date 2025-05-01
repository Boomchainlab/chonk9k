import React from 'react';

interface ChonkTokenLogoProps {
  size?: number;
  className?: string;
}

const ChonkTokenLogo: React.FC<ChonkTokenLogoProps> = ({ size = 40, className = '' }) => {
  return (
    <img 
      src="/chonk9k-logo.svg" 
      alt="CHONK9K Token" 
      width={size} 
      height={size} 
      className={`rounded-full ${className}`}
    />
  );
};

export default ChonkTokenLogo;
