import React from 'react';
import { Separator } from "@/components/ui/separator";
import ChonkTokenLogo from "./ChonkTokenLogo";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <ChonkTokenLogo size={32} useAnimation={false} />
              <h3 className="text-xl font-bold ml-3">Chonk9k</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              The future of feline finance in the cryptocurrency space.
              Built on Base with Solana tagging capabilities.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/BoomchainLabs/chonk9k-dapp" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-github text-xl"></i>
              </a>
              <a href="https://twitter.com/Chonkpump9000" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" 
                 className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-telegram text-xl"></i>
              </a>
              <a href="#" 
                 className="text-gray-400 hover:text-primary transition-colors">
                <i className="fab fa-discord text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Navigation</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="/marketplaces" className="hover:text-primary transition-colors">Exchanges</a></li>
              <li><a href="/mining" className="hover:text-primary transition-colors">Mining</a></li>
              <li><a href="/trivia" className="hover:text-primary transition-colors">Trivia</a></li>
              <li><a href="/profile/1" className="hover:text-primary transition-colors">Profile</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">Whitepaper</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="https://github.com/BoomchainLabs/chonk9k-dapp" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Contract Details</h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>Network: Base & Solana</p>
              <p>Token: CHONK9K</p>
              <p className="break-all">Contract Address: <a href="#" className="text-primary hover:underline">0x1234...5678</a></p>
              <p>Transaction Fee: 2% (1% Burn, 1% Dev)</p>
            </div>
          </div>
        </div>
        
        <Separator className="my-8 bg-gray-800" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm">
            &copy; 2024 Chonk9k. All rights reserved.
          </div>
        </div>
        
        <div className="mt-8 bg-gradient-to-r from-black to-[#1a1a1a] border border-[#ff00ff]/20 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-full border-2 border-[#ff00ff]/50 flex items-center justify-center bg-gradient-to-r from-[#ff00ff]/30 to-[#00e0ff]/30 text-xl font-bold text-white">
              DO
            </div>
            <div>
              <h4 className="font-bold text-xl bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] bg-clip-text text-transparent">David Okeamah</h4>
              <p className="text-gray-400 text-sm">Founder & Lead Developer</p>
            </div>
          </div>
          <a href="https://github.com/BoomchainLabs/chonk9k-dapp" target="_blank" rel="noopener noreferrer" 
             className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff00ff]/20 border border-[#ff00ff]/50 rounded-full hover:bg-[#ff00ff]/30 transition-colors mt-2">
            <i className="fab fa-github"></i> BoomchainLabs/chonk9k
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
