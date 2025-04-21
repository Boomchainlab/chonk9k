
import React from "react";
import chonkLogoPath from "@assets/8068BFA2-D4B5-44A2-9D90-E27485E99ED2.png";

interface CatLogoProps {
  size?: "small" | "medium" | "large";
  isAnimated?: boolean;
  showTwitter?: boolean;
}

const CatLogo: React.FC<CatLogoProps> = ({ 
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
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
      )}
      
      {showTwitter && (
        <div className="absolute -top-8 right-0 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-white">
          <a href="https://twitter.com/Chonkpump9000" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            @Chonkpump9000
          </a>
        </div>
      )}
      
      <div className="w-full h-full relative">
        <img 
          src={chonkLogoPath} 
          alt="Chonkpump 9000 Logo" 
          className={`w-full h-full object-contain ${isAnimated ? "drop-shadow-[0_0_10px_rgba(255,165,0,0.5)]" : ""}`}
        />
      </div>
    </div>
  );
};

export default CatLogo;
