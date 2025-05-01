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
        
        {/* Branding page link */}
        <div className="max-w-4xl mx-auto -mt-8 mb-16 px-4 text-center">
          <Link href="/token/branding">
            <Button className="bg-gradient-to-r from-[#ff00ff]/80 to-[#00e0ff]/80 hover:from-[#ff00ff] hover:to-[#00e0ff] text-white">
              View $CHONK9K Token Branding Assets
            </Button>
          </Link>
          <p className="text-gray-400 text-sm mt-2">
            Access comprehensive token documentation, logos, icons, and brand guidelines
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenPage;