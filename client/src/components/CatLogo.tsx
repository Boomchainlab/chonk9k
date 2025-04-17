
import React from "react";

interface CatLogoProps {
  size?: "small" | "medium" | "large";
  isAnimated?: boolean;
}

const CatLogo: React.FC<CatLogoProps> = ({ size = "medium", isAnimated = false }) => {
  const dimensions = {
    small: { outer: "h-10 w-10", inner: "h-8 w-8" },
    medium: { outer: "h-16 w-16", inner: "h-14 w-14" },
    large: { outer: "h-64 w-64 md:h-80 md:w-80", inner: "h-60 w-60 md:h-76 md:w-76" }
  };

  return (
    <div className={`relative ${dimensions[size].outer} ${isAnimated ? "animate-bounce-slow" : ""}`}>
      {isAnimated && (
        <>
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse"></div>
          <div className="absolute -top-8 right-0 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-white">
            <a href="https://twitter.com/Chonkpump9000" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              @Chonkpump9000
            </a>
          </div>
        </>
      )}
      <div className="w-full h-full bg-gradient-to-br from-primary to-[#FFB800] rounded-full p-2 shadow-[0_0_30px_rgba(255,184,0,0.3)]">
        <div className="w-full h-full bg-[#FFB800] rounded-full flex items-center justify-center overflow-hidden">
          <div className="w-4/5 h-4/5 relative">
            {/* Enhanced cat face */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#FFB800] to-[#FF8C00] border-4 border-dark"></div>
            <div className="absolute bottom-1/4 left-1/4 w-1/2 h-1/3 bg-[#F8F9FA] rounded-full transform -rotate-6"></div>
            <div className="absolute top-1/4 left-1/4 w-1/6 h-1/6 bg-dark rounded-full shadow-inner flex items-center justify-center">
              <div className="w-1/2 h-1/2 bg-white rounded-full absolute top-0 left-1/4"></div>
            </div>
            <div className="absolute top-1/4 right-1/4 w-1/6 h-1/6 bg-dark rounded-full shadow-inner flex items-center justify-center">
              <div className="w-1/2 h-1/2 bg-white rounded-full absolute top-0 left-1/4"></div>
            </div>
            <div className="absolute top-0 left-0 w-1/4 h-1/4 bg-[#FFB800] -translate-x-1/4 -translate-y-1/4 rounded-tr-full border-r-4 border-t-4 border-dark transform rotate-12"></div>
            <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-[#FFB800] translate-x-1/4 -translate-y-1/4 rounded-tl-full border-l-4 border-t-4 border-dark transform -rotate-12"></div>
            {/* Whiskers */}
            <div className="absolute left-1/4 top-1/2 w-1/4 h-0.5 bg-dark/30 transform -rotate-12"></div>
            <div className="absolute right-1/4 top-1/2 w-1/4 h-0.5 bg-dark/30 transform rotate-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatLogo;
