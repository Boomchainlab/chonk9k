import React from 'react';

interface NewChonkLogoProps {
  size?: 'small' | 'medium' | 'large';
  isAnimated?: boolean;
  className?: string;
}

const NewChonkLogo: React.FC<NewChonkLogoProps> = ({ 
  size = 'medium', 
  isAnimated = false,
  className = '' 
}) => {
  const dimensions = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-20 h-20'
  };

  const animationClass = isAnimated ? 'animate-pulse' : '';
  
  return (
    <div className={`${dimensions[size]} ${animationClass} ${className} relative`}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ff00ff] to-[#00e0ff] opacity-25"></div>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full"
      >
        <circle cx="50" cy="50" r="48" fill="#000" stroke="url(#chonk-gradient)" strokeWidth="4" />
        
        {/* Cat face features */}
        <path d="M30 40 Q50 70 70 40" stroke="#ff00ff" strokeWidth="3" fill="none" />
        <circle cx="35" cy="35" r="5" fill="#00e0ff" />
        <circle cx="65" cy="35" r="5" fill="#00e0ff" />
        
        {/* Cat ears */}
        <path d="M25 25 L35 35 L45 25 Z" fill="#ff00ff" />
        <path d="M55 25 L65 35 L75 25 Z" fill="#ff00ff" />
        
        {/* Cat whiskers */}
        <line x1="25" y1="50" x2="40" y2="48" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="25" y1="55" x2="40" y2="53" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="75" y1="50" x2="60" y2="48" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="75" y1="55" x2="60" y2="53" stroke="#ffffff" strokeWidth="1.5" />
        
        {/* Digital elements */}
        <rect x="40" y="60" width="20" height="2" fill="#00e0ff" />
        <rect x="35" y="65" width="30" height="2" fill="#00e0ff" />
        <rect x="30" y="70" width="40" height="2" fill="#00e0ff" />

        {/* Binary code bits around the edge */}
        {Array.from({length: 16}).map((_, i) => {
          const angle = (i * 22.5) * (Math.PI / 180);
          const x = 50 + 42 * Math.cos(angle);
          const y = 50 + 42 * Math.sin(angle);
          return (
            <text 
              key={i} 
              x={x} 
              y={y} 
              fill={i % 2 === 0 ? "#ff00ff" : "#00e0ff"} 
              fontSize="8" 
              textAnchor="middle" 
              dominantBaseline="middle"
            >
              {i % 2 === 0 ? '1' : '0'}
            </text>
          );
        })}
        
        <defs>
          <linearGradient id="chonk-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ff00ff" />
            <stop offset="1" stopColor="#00e0ff" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default NewChonkLogo;