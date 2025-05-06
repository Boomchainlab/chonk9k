import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Twitter, Globe, ExternalLink, MessageSquare } from 'lucide-react';

interface UpdateItem {
  type: "news" | "twitter" | "medium" | "reddit" | "discord";
  title: string;
  date: string;
  summary?: string;
  url?: string;
  author?: string;
  imageUrl?: string;
}

interface CommunityUpdatesProps {
  updates: UpdateItem[];
}

const getUpdateIcon = (type: string) => {
  switch (type) {
    case 'twitter':
      return <Twitter className="h-5 w-5 text-[#1DA1F2]" />;
    case 'medium':
      return <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center"><span className="text-white font-bold text-xs">M</span></div>;
    case 'reddit':
      return <div className="w-5 h-5 rounded-full bg-[#FF4500] flex items-center justify-center"><span className="text-white font-bold text-xs">r/</span></div>;
    case 'discord':
      return <MessageSquare className="h-5 w-5 text-[#7289DA]" />;
    default:
      return <Globe className="h-5 w-5 text-[#ff00ff]" />;
  }
};

const CommunityUpdates: React.FC<CommunityUpdatesProps> = ({ updates }) => {
  return (
    <Card className="bg-black/60 backdrop-blur-xl rounded-xl border border-[#ff00ff]/30 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-[#ff00ff]/20 to-transparent border-b border-[#ff00ff]/30 pb-3 px-4 pt-4">
        <h3 className="text-lg font-bold text-[#ff00ff] flex items-center">
          <span className="mr-2">📢</span>
          Community Updates
        </h3>
      </div>
      <CardContent className="p-0">
        <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#ff00ff]/20 scrollbar-track-transparent">
          {updates.map((update, index) => (
            <div 
              key={index} 
              className={`p-4 hover:bg-white/5 transition-colors ${index !== updates.length - 1 ? 'border-b border-gray-800' : ''}`}
            >
              <div className="flex items-start">
                <div className="mr-3 mt-1">
                  {getUpdateIcon(update.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-white text-sm">{update.title}</h3>
                  <div className="text-xs text-gray-400 mt-1 mb-2">
                    {update.author && <span>{update.author} · </span>}
                    {update.date}
                  </div>
                  
                  {update.imageUrl && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-gray-800">
                      <img 
                        src={update.imageUrl} 
                        alt={update.title} 
                        className="w-full h-32 object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/news/default.jpg';
                        }}
                      />
                    </div>
                  )}
                  
                  {update.summary && (
                    <p className="text-xs text-gray-300 mb-3">
                      {update.summary}
                    </p>
                  )}
                  
                  {update.url && (
                    <a 
                      href={update.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button size="sm" variant="link" className="h-7 p-0 text-[#ff00ff] hover:text-[#ff00ff]/80">
                        Read more
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-800 text-center">
          <a 
            href="https://t.me/CHONK9K" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block w-full"
          >
            <Button variant="outline" className="bg-black/30 border-[#ff00ff]/50 text-[#ff00ff] hover:bg-[#ff00ff]/20 w-full">
              Join CHONK9K Community
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunityUpdates;