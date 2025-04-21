import React from "react";

interface BlueCatLogoProps {
  size?: "small" | "medium" | "large";
  isAnimated?: boolean;
  showTwitter?: boolean;
}

const BlueCatLogo: React.FC<BlueCatLogoProps> = ({ 
  size = "medium", 
  isAnimated = false,
  showTwitter = false
}) => {
  const dimensions = {
    small: "h-10 w-10",
    medium: "h-16 w-16",
    large: "h-64 w-64 md:h-80 md:w-80"
  };

  return (
    <div className={`relative ${dimensions[size]} ${isAnimated ? "animate-bounce-slow" : ""}`}>
      {isAnimated && (
        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse"></div>
      )}
      
      {showTwitter && (
        <div className="absolute -top-8 right-0 bg-blue-900/60 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-white">
          <a href="https://twitter.com/Chonkpump9000" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300 transition-colors">
            @Chonkpump9000
          </a>
        </div>
      )}
      
      <div className="w-full h-full relative">
        {/* SVG cat logo in Base blue colors */}
        <svg viewBox="0 0 400 400" className={`w-full h-full ${isAnimated ? "drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" : ""}`}>
          {/* Background */}
          <rect x="50" y="50" width="300" height="300" rx="60" ry="60" fill="#0052FF" />
          
          {/* Rays */}
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 22.5 * Math.PI) / 180;
            const x1 = 200 + 100 * Math.cos(angle);
            const y1 = 200 + 100 * Math.sin(angle);
            const x2 = 200 + 150 * Math.cos(angle);
            const y2 = 200 + 150 * Math.sin(angle);
            return (
              <line 
                key={i} 
                x1={x1} 
                y1={y1} 
                x2={x2} 
                y2={y2} 
                stroke="#0066FF" 
                strokeWidth="4" 
              />
            );
          })}
          
          {/* Cat Face */}
          <circle cx="200" cy="200" r="95" fill="#4285F4" />
          <circle cx="200" cy="220" r="60" fill="#FFFFFF" />
          
          {/* Eyes */}
          <circle cx="170" cy="180" r="15" fill="#FFFFFF" />
          <circle cx="230" cy="180" r="15" fill="#FFFFFF" />
          <circle cx="170" cy="180" r="8" fill="#000000" />
          <circle cx="230" cy="180" r="8" fill="#000000" />
          <circle cx="166" cy="176" r="4" fill="#FFFFFF" />
          <circle cx="226" cy="176" r="4" fill="#FFFFFF" />
          
          {/* Nose */}
          <circle cx="200" cy="200" r="8" fill="#333333" />
          
          {/* Smile */}
          <path 
            d="M 160 210 Q 200 240 240 210" 
            fill="none" 
            stroke="#333333" 
            strokeWidth="5" 
            strokeLinecap="round"
          />
          
          {/* Whiskers */}
          <line x1="150" y1="205" x2="110" y2="190" stroke="#333333" strokeWidth="3" />
          <line x1="150" y1="215" x2="110" y2="220" stroke="#333333" strokeWidth="3" />
          <line x1="250" y1="205" x2="290" y2="190" stroke="#333333" strokeWidth="3" />
          <line x1="250" y1="215" x2="290" y2="220" stroke="#333333" strokeWidth="3" />
          
          {/* Ears */}
          <path d="M 150 130 L 180 160 L 130 180 Z" fill="#4285F4" stroke="#333333" strokeWidth="4" />
          <path d="M 250 130 L 220 160 L 270 180 Z" fill="#4285F4" stroke="#333333" strokeWidth="4" />
        </svg>
      </div>
    </div>
  );
};

export default BlueCatLogo;