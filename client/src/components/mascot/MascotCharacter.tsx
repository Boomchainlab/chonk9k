import React, { useState, useEffect } from 'react';

interface MascotCharacterProps {
  type: 'crypto_chonk' | 'pixel_chonk' | 'robot_chonk';
  animation: 'default' | 'excited' | 'thinking' | 'teaching';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
}

const MascotCharacter: React.FC<MascotCharacterProps> = ({
  type = 'crypto_chonk',
  animation = 'default',
  size = 'medium',
  className = '',
  onClick
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Handle animation state
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 3000); // Animation duration
    
    return () => clearTimeout(timer);
  }, [animation]);
  
  // Size classes
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };
  
  // Animation classes based on the animation prop
  const getAnimationClass = () => {
    if (!isAnimating) return '';
    
    switch (animation) {
      case 'excited':
        return 'animate-bounce';
      case 'thinking':
        return 'animate-pulse';
      case 'teaching':
        return 'animate-float';
      default:
        return 'animate-wiggle';
    }
  };
  
  // Get the mascot image based on the type and animation
  const getMascotImage = () => {
    const basePath = '/images/mascots';
    
    switch (type) {
      case 'crypto_chonk':
        return `${basePath}/crypto_chonk_${animation}.svg`;
      case 'pixel_chonk':
        return `${basePath}/pixel_chonk_${animation}.svg`;
      case 'robot_chonk':
        return `${basePath}/robot_chonk_${animation}.svg`;
      default:
        return `${basePath}/crypto_chonk_default.svg`;
    }
  };
  
  // Fallback mascot SVG (in case the images are missing)
  const FallbackMascot = () => (
    <svg 
      viewBox="0 0 100 100" 
      className={`${sizeClasses[size]} ${getAnimationClass()} ${className}`}
      onClick={onClick}
    >
      <circle cx="50" cy="50" r="45" fill="#8A2BE2" />
      <circle cx="35" cy="40" r="5" fill="white" />
      <circle cx="65" cy="40" r="5" fill="white" />
      <path d="M40,65 Q50,75 60,65" stroke="white" strokeWidth="3" fill="none" />
      <path d="M25,25 L40,30" stroke="white" strokeWidth="2" />
      <path d="M75,25 L60,30" stroke="white" strokeWidth="2" />
    </svg>
  );
  
  // Using the actual image with fallback
  return (
    <div 
      className={`relative cursor-pointer transition-transform duration-300 ${getAnimationClass()} ${className}`}
      onClick={onClick}
    >
      <img 
        src={getMascotImage()} 
        alt={`${type} mascot`} 
        className={`${sizeClasses[size]} object-contain`}
        onError={(e) => {
          // Fallback to the SVG if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement?.classList.add('fallback-active');
        }}
      />
      <div className="fallback hidden fallback-active:block">
        <FallbackMascot />
      </div>
    </div>
  );
};

export default MascotCharacter;
