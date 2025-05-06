import React, { useState, useEffect, useCallback } from 'react';
import MascotCharacter from './MascotCharacter';
import MascotTip from './MascotTip';
import { useMascot } from '@/hooks/useMascot';

interface MentorMascotProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  autoDisplay?: boolean;
  displayDelay?: number;
  onTipClosed?: () => void;
  className?: string;
}

const MentorMascot: React.FC<MentorMascotProps> = ({
  position = 'bottom-right',
  autoDisplay = true,
  displayDelay = 3000,
  onTipClosed,
  className = ''
}) => {
  const [tipVisible, setTipVisible] = useState(false);
  const [currentTip, setCurrentTip] = useState<any>(null);
  const mascot = useMascot();
  
  // Position classes
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };
  
  // Function to close the tip
  const handleCloseTip = useCallback(() => {
    setTipVisible(false);
    if (onTipClosed) onTipClosed();
    
    // Mark tip as displayed
    if (currentTip && mascot.markTipAsDisplayed) {
      mascot.markTipAsDisplayed(currentTip.id);
    }
  }, [currentTip, onTipClosed, mascot]);
  
  // Auto display tip on load or when tip changes
  useEffect(() => {
    if (autoDisplay && mascot.settings?.isEnabled && mascot.currentTip) {
      const timer = setTimeout(() => {
        setCurrentTip(mascot.currentTip);
        setTipVisible(true);
      }, displayDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoDisplay, displayDelay, mascot.currentTip, mascot.settings?.isEnabled]);
  
  // Handle mascot click - show/hide tip
  const handleMascotClick = () => {
    if (!mascot.settings?.isEnabled) return;
    
    if (tipVisible) {
      handleCloseTip();
    } else {
      // Get a new tip if we don't have one
      if (!currentTip && mascot.fetchRandomTip) {
        mascot.fetchRandomTip().then((tip) => {
          if (tip) {
            setCurrentTip(tip);
            setTipVisible(true);
          }
        });
      } else {
        setTipVisible(true);
      }
    }
  };
  
  // Don't render if mascot is disabled
  if (!mascot.settings?.isEnabled) return null;
  
  return (
    <div className={`fixed ${positionClasses[position]} z-40 flex flex-col items-center ${className}`}>
      {/* Tip Speech Bubble */}
      <div className={`mb-2 transform ${tipVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'} transition-all duration-300`}>
        <MascotTip 
          tip={currentTip} 
          visible={tipVisible} 
          onClose={handleCloseTip} 
          style={mascot.settings?.speechBubbleStyle || 'default'} 
        />
      </div>
      
      {/* Mascot Character */}
      <MascotCharacter 
        type={mascot.settings?.mascotType || 'crypto_chonk'}
        animation={mascot.settings?.animation || 'default'}
        size="medium" 
        onClick={handleMascotClick}
        className="cursor-pointer hover:scale-110 transition-transform duration-300"
      />
    </div>
  );
};

export default MentorMascot;
