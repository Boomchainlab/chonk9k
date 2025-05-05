import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedChonkProps {
  size?: 'small' | 'medium' | 'large';
  mood?: 'happy' | 'neutral' | 'excited';
  className?: string;
}

export const AnimatedChonk: React.FC<AnimatedChonkProps> = ({ 
  size = 'medium', 
  mood = 'excited',
  className = ''
}) => {
  // Size mapping
  const sizeMap = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  // Color mapping based on mood
  const colorMap = {
    happy: {
      primary: '#FF00FF', // Magenta
      secondary: '#00E0FF', // Cyan
      eyes: '#FFFFFF', // White
      highlight: '#FFD700' // Gold
    },
    neutral: {
      primary: '#9A4EFC', // Purple
      secondary: '#00E0FF', // Cyan
      eyes: '#FFFFFF', // White
      highlight: '#8A2BE2' // Violet
    },
    excited: {
      primary: '#FF00FF', // Magenta
      secondary: '#FC4E68', // Pink-red
      eyes: '#FFFFFF', // White
      highlight: '#FFA500' // Orange
    }
  };

  const colors = colorMap[mood];

  // Animation variants
  const containerVariants = {
    idle: {
      scale: 1,
      rotate: 0
    },
    animate: {
      scale: [1, 1.05, 1],
      rotate: [-2, 2, -2, 2, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop' as const
      }
    }
  };

  const eyesVariants = {
    blink: {
      scaleY: [1, 0.1, 1],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: 'loop' as const,
        repeatDelay: 3
      }
    }
  };

  const tailVariants = {
    wag: {
      rotate: [-10, 10, -10],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: 'loop' as const
      }
    }
  };

  return (
    <div className={`relative ${sizeMap[size]} ${className}`}>
      <motion.div
        className="absolute inset-0"
        variants={containerVariants}
        initial="idle"
        animate="animate"
      >
        {/* Cat body - cyberpunk style with gradient */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Body */}
          <motion.div 
            className="absolute w-full h-full rounded-full bg-gradient-to-br" 
            style={{
              background: `radial-gradient(circle, ${colors.primary} 0%, ${colors.secondary} 100%)`,
              boxShadow: `0 0 15px ${colors.primary}`,
            }}
          />
          
          {/* Face */}
          <div className="absolute w-full h-full flex items-center justify-center">
            {/* Eyes */}
            <motion.div 
              className="absolute flex w-full justify-center"
              style={{ top: '40%' }}
              variants={eyesVariants}
              animate="blink"
            >
              <div className="w-2.5 h-3.5 bg-white rounded-full mx-2 flex items-center justify-center">
                <div className="w-1.5 h-2 bg-black rounded-full"></div>
              </div>
              <div className="w-2.5 h-3.5 bg-white rounded-full mx-2 flex items-center justify-center">
                <div className="w-1.5 h-2 bg-black rounded-full"></div>
              </div>
            </motion.div>
            
            {/* Mouth */}
            <div 
              className="absolute rounded-t-full"
              style={{ 
                width: '25%', 
                height: '10%', 
                top: '55%',
                background: mood === 'excited' ? colors.highlight : '#000'
              }}
            ></div>
          </div>
          
          {/* Ears */}
          <div 
            className="absolute w-3 h-3 rounded-tl-full" 
            style={{ 
              background: colors.primary,
              top: '20%', 
              left: '25%', 
              transform: 'rotate(-30deg)' 
            }}
          ></div>
          <div 
            className="absolute w-3 h-3 rounded-tr-full" 
            style={{ 
              background: colors.primary,
              top: '20%', 
              right: '25%', 
              transform: 'rotate(30deg)' 
            }}
          ></div>
          
          {/* Tail */}
          <motion.div 
            className="absolute w-6 h-2 rounded-full" 
            style={{ 
              background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})`,
              bottom: '10%', 
              right: '10%', 
              transformOrigin: 'right center',
              boxShadow: `0 0 5px ${colors.primary}`
            }}
            variants={tailVariants}
            animate="wag"
          ></motion.div>
          
          {/* Cyberpunk elements - glowing parts */}
          <div 
            className="absolute w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ 
              background: colors.highlight,
              boxShadow: `0 0 5px ${colors.highlight}`,
              top: '25%', 
              left: '40%' 
            }}
          ></div>
          <div 
            className="absolute w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ 
              background: colors.highlight,
              boxShadow: `0 0 5px ${colors.highlight}`,
              top: '25%', 
              right: '40%' 
            }}
          ></div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnimatedChonk;