import React from 'react';
import SimpleTokenDisplay from "@/components/SimpleTokenDisplay";

const TokenPage: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full bg-black">
      {/* Background elements */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20" 
        style={{ backgroundImage: 'url(/images/cyberpunk-city.jpg)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90" />
      
      {/* Content */}
      <div className="relative z-10">
        <SimpleTokenDisplay />
      </div>
    </div>
  );
};

export default TokenPage;