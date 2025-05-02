import React from 'react';
import { Link } from 'wouter';
import SimpleTokenDisplay from "@/components/SimpleTokenDisplay";
import { Button } from "@/components/ui/button";

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
        
        {/* Links to token-related pages */}
        <div className="max-w-4xl mx-auto -mt-8 mb-16 px-4 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Link href="/token/branding">
              <Button className="bg-gradient-to-r from-[#ff00ff]/80 to-[#00e0ff]/80 hover:from-[#ff00ff] hover:to-[#00e0ff] text-white w-full sm:w-auto">
                View Token Branding Assets
              </Button>
            </Link>
            
            <Link href="/token/mood">
              <Button className="bg-gradient-to-r from-[#00e0ff]/80 to-[#ff00ff]/80 hover:from-[#00e0ff] hover:to-[#ff00ff] text-white w-full sm:w-auto">
                View Chonk Mood Tracker
              </Button>
            </Link>
            
            <Link href="/token/wordpress">
              <Button className="bg-gradient-to-r from-[#ff00ff]/80 to-[#00e0ff]/80 hover:from-[#ff00ff] hover:to-[#00e0ff] text-white w-full sm:w-auto">
                WordPress Integration
              </Button>
            </Link>
          </div>
          
          <p className="text-gray-400 text-sm mt-2">
            Access $CHONK9K token resources, branding assets, price performance indicators, and WordPress integration tools
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenPage;