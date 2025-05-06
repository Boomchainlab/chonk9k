import React from 'react';

export interface TokenIconProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  type?: 'default' | 'enhanced' | 'social';
  className?: string;
  showBackground?: boolean;
}

/**
 * Component for displaying various CHONK9K token icons and logos
 */
const TokenIcons: React.FC<TokenIconProps> = ({ 
  size = 'medium', 
  type = 'default',
  className = '',
  showBackground = false,
}) => {
  // Determine dimensions based on size
  const dimensions = {
    small: { width: 32, height: 32 },
    medium: { width: 64, height: 64 },
    large: { width: 128, height: 128 },
    xlarge: { width: 256, height: 256 },
  }[size];

  // Determine image source based on type
  let src = '/chonk9k-logo.svg';
  
  if (type === 'enhanced') {
    src = '/chonk9k-enhanced-logo.svg';
  } else if (type === 'social') {
    src = '/icons/chonk9k-social.svg';
  }
  
  // For smaller sizes, use optimized icons
  if (size === 'small' && type === 'default') {
    src = '/icons/chonk9k-icon-32.svg';
  } else if (size === 'medium' && type === 'default') {
    src = '/icons/chonk9k-icon-64.svg';
  }

  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      style={{ minWidth: dimensions.width, minHeight: dimensions.height }}
    >
      {showBackground && (
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff00ff]/30 to-[#00e0ff]/30 blur-xl"
          style={{ width: dimensions.width * 1.2, height: dimensions.height * 1.2, top: -dimensions.width * 0.1, left: -dimensions.height * 0.1 }}
        />
      )}
      <img 
        src={src} 
        alt="CHONK9K Token" 
        width={dimensions.width} 
        height={dimensions.height}
        className={`${showBackground ? 'relative z-10' : ''}`}
      />
    </div>
  );
};

export default TokenIcons;