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
      {isAnimated && <div className="absolute inset-0 bg-primary rounded-full opacity-20 animate-pulse"></div>}
      <div className="w-full h-full bg-primary rounded-full p-2 shadow-2xl">
        <div className="w-full h-full bg-[#FFB800] rounded-full flex items-center justify-center">
          <div className="w-4/5 h-4/5 relative">
            {/* Stylized cat based on provided image */}
            <div className="absolute inset-0 rounded-full bg-[#FFB800] border-4 border-dark"></div>
            <div className="absolute bottom-1/4 left-1/4 w-1/2 h-1/3 bg-[#F8F9FA] rounded-full"></div>
            <div className="absolute top-1/4 left-1/4 w-1/6 h-1/6 bg-dark rounded-full"></div>
            <div className="absolute top-1/4 right-1/4 w-1/6 h-1/6 bg-dark rounded-full"></div>
            <div className="absolute top-0 left-0 w-1/4 h-1/4 bg-[#FFB800] -translate-x-1/4 -translate-y-1/4 rounded-tr-full border-r-4 border-t-4 border-dark transform rotate-12"></div>
            <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-[#FFB800] translate-x-1/4 -translate-y-1/4 rounded-tl-full border-l-4 border-t-4 border-dark transform -rotate-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatLogo;
