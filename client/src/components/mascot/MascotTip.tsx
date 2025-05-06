import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ChevronLeft, ChevronRight, BookOpen, Share2 } from 'lucide-react';

export interface DailyTip {
  id: number;
  tip: string;
  category: string;
  difficulty?: string;
  tags?: string[];
  hasBeenDisplayed?: boolean;
  displayCount?: number;
}

interface MascotTipProps {
  tip: DailyTip | null;
  visible: boolean;
  onClose: () => void;
  style?: 'default' | 'neon' | 'minimal' | 'blockchain';
}

const MascotTip: React.FC<MascotTipProps> = ({ 
  tip, 
  visible, 
  onClose,
  style = 'default' 
}) => {
  const [animation, setAnimation] = useState('');

  // Apply entrance and exit animations
  useEffect(() => {
    if (visible) {
      setAnimation('animate-fade-in');
    } else {
      setAnimation('animate-fade-out');
    }
  }, [visible]);

  // Don't render if we don't have a tip or if not visible
  if (!tip || !visible) return null;

  // Styles based on the selected theme
  const themeStyles = {
    default: {
      container: 'bg-black/60 backdrop-blur-md border border-[#00e0ff]/30 text-white',
      header: 'text-[#00e0ff]',
      badge: 'bg-[#ff00ff]/20 text-[#ff00ff]',
      button: 'bg-[#00e0ff]/20 text-[#00e0ff] hover:bg-[#00e0ff]/30',
      closeButton: 'text-white/60 hover:text-white'
    },
    neon: {
      container: 'bg-black/80 backdrop-blur-md border-2 border-[#ff00ff] shadow-[0_0_15px_rgba(255,0,255,0.5)] text-white',
      header: 'text-[#ff00ff]',
      badge: 'bg-[#00e0ff]/20 text-[#00e0ff]',
      button: 'bg-[#ff00ff]/20 text-[#ff00ff] hover:bg-[#ff00ff]/30',
      closeButton: 'text-[#ff00ff]/60 hover:text-[#ff00ff]'
    },
    minimal: {
      container: 'bg-gray-900/90 backdrop-blur-md border border-gray-700 text-white',
      header: 'text-white',
      badge: 'bg-gray-700 text-gray-300',
      button: 'bg-gray-800 text-gray-300 hover:bg-gray-700',
      closeButton: 'text-gray-400 hover:text-white'
    },
    blockchain: {
      container: 'bg-[#1e3a8a]/90 backdrop-blur-md border border-orange-500/30 text-white',
      header: 'text-orange-500',
      badge: 'bg-blue-900 text-blue-300',
      button: 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30',
      closeButton: 'text-white/60 hover:text-white'
    }
  };

  const currentStyle = themeStyles[style];

  // Get difficulty display (with emoji)
  const getDifficultyDisplay = () => {
    switch(tip.difficulty?.toLowerCase()) {
      case 'beginner':
        return '🔰 Beginner';
      case 'intermediate':
        return '🧠 Intermediate';
      case 'advanced':
        return '🚀 Advanced';
      case 'expert':
        return '💎 Expert';
      default:
        return tip.difficulty || 'General';
    }
  };

  return (
    <div className={`${animation} w-[300px] max-w-sm z-50 transform`}>
      <Card className={`overflow-hidden ${currentStyle.container}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className={`text-sm font-semibold ${currentStyle.header}`}>
                Daily Crypto Tip
              </h4>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 rounded-full ${currentStyle.closeButton}`}
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm my-3">{tip.tip}</p>
          
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {tip.difficulty && (
              <Badge variant="outline" className={currentStyle.badge}>
                {getDifficultyDisplay()}
              </Badge>
            )}
            {tip.category && (
              <Badge variant="outline" className={currentStyle.badge}>
                {tip.category}
              </Badge>
            )}
          </div>
          
          <div className="flex justify-between mt-4">
            <Button
              variant="ghost" 
              size="sm"
              className={currentStyle.button}
              title="Learn more"
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Learn More
            </Button>
            
            <Button
              variant="ghost" 
              size="sm"
              className={currentStyle.button}
              title="Share tip"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MascotTip;
