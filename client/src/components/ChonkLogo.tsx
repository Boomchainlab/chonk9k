import React from "react";
import { cn } from "@/lib/utils";

interface ChonkLogoProps {
  size?: "small" | "medium" | "large";
  variant?: "blue" | "pink" | "cream" | "purple";
  isAnimated?: boolean;
  showTwitter?: boolean;
  className?: string;
}

const ChonkLogo: React.FC<ChonkLogoProps> = ({ 
  size = "medium", 
  variant = "blue",
  isAnimated = false,
  showTwitter = false,
  className
}) => {
  const dimensions = {
    small: "h-10 w-10",
    medium: "h-16 w-16",
    large: "h-64 w-64 md:h-80 md:w-80"
  };

  // Colors for different variants
  const colors = {
    blue: {
      primary: "#0095ff",
      secondary: "#00e0ff",
      accent: "#0052FF",
      background: "#001242",
      text: "#0095ff"
    },
    pink: {
      primary: "#ff00ff", 
      secondary: "#bf00ff",
      accent: "#ff42e9", 
      background: "#28003e", 
      text: "#ff00ff"
    },
    cream: {
      primary: "#f0e6d2", 
      secondary: "#00d2c6", 
      accent: "#8be8e0", 
      background: "#ffffff", 
      text: "#15154d"
    },
    purple: {
      primary: "#9c6ade", 
      secondary: "#7e5bb0", 
      accent: "#b490e0", 
      background: "#1e0b40", 
      text: "#9c6ade"
    }
  };

  const color = colors[variant];

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
        <svg viewBox="0 0 400 400" className={`w-full h-full ${isAnimated ? `drop-shadow-[0_0_10px_${color.primary}80]` : ""}`}>
          {/* Base blockchain logo at top */}
          <g transform="translate(175, 60) scale(0.5)">
            <rect width="100" height="15" fill={color.secondary} rx="2" ry="2" />
            <rect y="25" width="100" height="15" fill={color.secondary} rx="2" ry="2" />
            <rect y="50" width="100" height="15" fill={color.secondary} rx="2" ry="2" />
          </g>
          
          {/* Stars */}
          <g>
            <path d="M340,100 L345,115 L360,120 L345,125 L340,140 L335,125 L320,120 L335,115 Z" fill={color.secondary} />
            <path d="M320,80 L323,90 L333,93 L323,96 L320,106 L317,96 L307,93 L317,90 Z" fill={color.secondary} />
          </g>

          {/* Circular background for cat */}
          <circle cx="200" cy="200" r="100" fill="none" stroke={color.primary} strokeWidth="6" />
          
          {/* Cat body */}
          <path d="M160,150 Q125,130 140,180 Q145,220 170,255 Q195,275 230,255 Q250,235 260,180 Q270,140 240,150 Q230,120 200,120 Q170,120 160,150 Z" 
                fill="none" stroke={color.primary} strokeWidth="6" />

          {/* Cat face features */}
          <g fill="none" stroke={color.primary} strokeWidth="4" strokeLinecap="round">
            {/* Eyes */}
            <circle cx="180" cy="170" r="5" />
            <circle cx="220" cy="170" r="5" />
            
            {/* Nose */}
            <path d="M200,185 L200,195" />
            <path d="M190,195 Q200,205 210,195" />
            
            {/* Whiskers */}
            <path d="M175,190 L150,185" />
            <path d="M175,195 L150,195" />
            <path d="M175,200 L150,205" />
            
            <path d="M225,190 L250,185" />
            <path d="M225,195 L250,195" />
            <path d="M225,200 L250,205" />
            
            {/* Ears */}
            <path d="M175,140 L160,120" />
            <path d="M225,140 L240,120" />
          </g>
          
          {/* Tail */}
          <path d="M230,255 Q250,280 240,300" fill="none" stroke={color.primary} strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>
      
      {/* Optional: Add "CHONKYNFT" text below when size is large */}
      {size === "large" && (
        <div className="mt-4 text-center">
          <h1 className="text-4xl font-bold" style={{color: color.text}}>CHONKYNFT</h1>
          <p className="text-sm tracking-widest" style={{color: color.secondary}}>MINT. EXPLORE. STAKE.</p>
        </div>
      )}
    </div>
  );
};

export default ChonkLogo;
