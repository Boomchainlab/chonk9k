import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CHONK9K_TOKEN_ADDRESS } from "@/lib/solanaTokenService";

interface TokenInfoProps {
  className?: string;
}

const TokenInfoPanel: React.FC<TokenInfoProps> = ({ className = '' }) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Token address copied to clipboard',
    });
  };

  const openInExplorer = () => {
    window.open(`https://solscan.io/token/${CHONK9K_TOKEN_ADDRESS}`, '_blank');
  };

  return (
    <Card className={`bg-black/90 backdrop-blur-xl border border-[#ff00ff]/30 text-white shadow-lg shadow-[#ff00ff]/10 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-center bg-cover" style={{ backgroundImage: 'url(/logo.png)' }} />
          </div>
          <span className="bg-gradient-to-r from-[#ff00ff] to-[#00e0ff] bg-clip-text text-transparent">
            Chonk9k Token
          </span>
          <Badge variant="outline" className="ml-auto text-xs border-[#ff00ff]/30 text-[#ff00ff]">
            Solana SPL
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <div className="text-sm text-gray-400">Token Contract</div>
          <div className="flex items-center gap-2">
            <code className="px-2 py-1 rounded bg-black/50 text-sm truncate font-mono flex-1">
              {CHONK9K_TOKEN_ADDRESS}
            </code>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => copyToClipboard(CHONK9K_TOKEN_ADDRESS)}
              className="h-8 w-8 rounded-full hover:bg-[#ff00ff]/10 hover:text-[#ff00ff]"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={openInExplorer}
              className="h-8 w-8 rounded-full hover:bg-[#00e0ff]/10 hover:text-[#00e0ff]"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-gray-400">Decimals</div>
            <div className="font-medium">9</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-gray-400">Token Type</div>
            <div className="font-medium">SPL</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-gray-400">Total Supply</div>
            <div className="font-medium">9,000,000,000</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-gray-400">Holders</div>
            <div className="font-medium">5,200+</div>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-sm text-gray-400">Description</div>
          <div className="text-sm">
            $CHONK9K is a community-driven meme token that combines cryptocurrency enthusiasm with
            engaging web experiences and cyberpunk aesthetics.
          </div>
        </div>
        
        <div className="pt-2">
          <div className="text-center text-sm text-[#00e0ff]">
            <a 
              href="https://raydium.io/swap/?inputCurrency=sol&outputCurrency=DnUsQnwNot38V9JbisNC18VHZkae1eKK5N2Dgy55pump" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline"
            >
              Trade on Raydium
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenInfoPanel;