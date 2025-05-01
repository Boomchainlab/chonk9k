import React from 'react';

interface ChonkTokenLogoProps {
  size?: number;
  className?: string;
}

const ChonkTokenLogo: React.FC<ChonkTokenLogoProps> = ({ size = 40, className = '' }) => {
  return (
    <div 
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circle background with gradient */}
        <circle cx="50" cy="50" r="50" fill="url(#chonk-gradient)" />
        
        {/* Cat face pattern */}
        <path d="M30 35C30 32.2386 32.2386 30 35 30H65C67.7614 30 70 32.2386 70 35V65C70 67.7614 67.7614 70 65 70H35C32.2386 70 30 67.7614 30 65V35Z" fill="black" />
        
        {/* Cat ears */}
        <path d="M25 30L35 45H15L25 30Z" fill="#FF00FF" />
        <path d="M75 30L85 45H65L75 30Z" fill="#00E0FF" />
        
        {/* Cat eyes */}
        <circle cx="35" cy="50" r="8" fill="#FF00FF" />
        <circle cx="65" cy="50" r="8" fill="#00E0FF" />
        
        {/* Cat nose */}
        <path d="M50 55L45 65H55L50 55Z" fill="white" />
        
        {/* Cat mouth */}
        <path d="M40 70C45 75 55 75 60 70" stroke="white" strokeWidth="2" strokeLinecap="round" />
        
        {/* Glowing effect */}
        <circle cx="35" cy="50" r="4" fill="white" />
        <circle cx="65" cy="50" r="4" fill="white" />
        
        {/* Add '$' symbol */}
        <text x="50" y="28" fontFamily="Arial" fontSize="24" fontWeight="bold" fill="white" textAnchor="middle">$</text>
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="chonk-gradient" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#FF00FF" />
            <stop offset="1" stopColor="#00E0FF" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Animated glow effect */}
      <div 
        className="absolute inset-0 rounded-full bg-[#ff00ff] opacity-30 blur-xl animate-pulse"
        style={{ animationDuration: '3s' }}
      />
    </div>
  );
};

export default ChonkTokenLogo;