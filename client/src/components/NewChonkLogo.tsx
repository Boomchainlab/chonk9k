import React from "react";
import { cn } from "@/lib/utils";
import tokenLogo from '@assets/806ED59A-7B11-4101-953C-13897F5FFD73.jpeg';

interface NewChonkLogoProps {
  size?: "small" | "medium" | "large";
  isAnimated?: boolean;
  showTwitter?: boolean;
  className?: string;
}

const NewChonkLogo: React.FC<NewChonkLogoProps> = ({ 
  size = "medium", 
  isAnimated = false,
  showTwitter = false,
  className
}) => {
  const dimensions = {
    small: "h-10 w-10",
    medium: "h-16 w-16",
    large: "h-64 w-64 md:h-80 md:w-80"
  };

  return (
    <div className={cn(`relative ${dimensions[size]} ${isAnimated ? "animate-bounce-slow" : ""}`, className)}>
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
          src={tokenLogo} 
          alt="CHONK 9000 Logo" 
          className={`w-full h-full rounded-full object-cover ${isAnimated ? `drop-shadow-[0_0_10px_#00e0ff80]` : ""}`}
          onError={(e) => {
            console.error('Logo loading error:', e);
            const target = e.target as HTMLImageElement;
            target.src = '/images/cyber_chonk_logo.png';
          }}
        />
      </div>
      
      {/* Optional: Add "CHONK9K" text below when size is large */}
      {size === "large" && (
        <div className="mt-4 text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00e0ff] to-[#0095ff]">CHONK 9000</h1>
          <p className="text-sm tracking-widest text-[#00e0ff]">TRADE. STAKE. EARN.</p>
        </div>
      )}
    </div>
  );
};

export default NewChonkLogo;