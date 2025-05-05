import React from 'react';
import { motion } from 'framer-motion';
import AnimatedChonk from './AnimatedChonk';

interface WalletConnectingOverlayProps {
  isVisible: boolean;
  walletType: string;
  onClose?: () => void;
}

const WalletConnectingOverlay: React.FC<WalletConnectingOverlayProps> = ({
  isVisible,
  walletType,
  onClose
}) => {
  if (!isVisible) return null;

  const capitalizedWalletType = walletType.charAt(0).toUpperCase() + walletType.slice(1);

  // Text messages to cycle through
  const loadingMessages = [
    'Preparing to connect...',
    `Connecting to ${capitalizedWalletType}...`,
    'Establishing connection...',
    'Almost there...',
    'Getting blockchain data...',
    'Powering up CHONK9K...',
    'Charging cybernetic circuits...',
    'Warming up plasma reactor...',
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full max-w-md p-8 overflow-hidden rounded-lg bg-black/70 border border-[#ff00ff]/40 shadow-lg">
        {/* Close button (optional) */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}

        <div className="flex flex-col items-center justify-center py-6">
          {/* Chonk animation */}
          <div className="mb-6">
            <AnimatedChonk size="large" mood="excited" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-2 text-center">
            Connecting to {capitalizedWalletType}
          </h3>

          {/* Loading text */}
          <motion.div
            className="text-[#00e0ff] text-lg text-center mb-6 min-h-[2rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 2,
              repeatDelay: 1,
            }}
            key={Date.now()} // Force re-render on each cycle
          >
            {loadingMessages[Math.floor(Math.random() * loadingMessages.length)]}
          </motion.div>

          {/* Glowing dots */}
          <div className="flex justify-center space-x-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-[#ff00ff]"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: 1 }}
                transition={{
                  repeat: Infinity,
                  repeatType: 'reverse',
                  duration: 0.8,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          {/* Cyber circuit decoration lines */}
          <div className="absolute bottom-0 left-0 w-full h-2 overflow-hidden">
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#ff00ff] via-[#00e0ff] to-[#ff00ff]"
              style={{ width: '200%' }}
              animate={{
                x: ['-100%', '0%'],
              }}
              transition={{
                repeat: Infinity,
                repeatType: 'loop',
                duration: 3,
                ease: 'linear',
              }}
            />
          </div>
          
          <div className="absolute top-0 right-0 w-2 h-full overflow-hidden">
            <motion.div
              className="absolute top-0 right-0 w-1 bg-gradient-to-b from-[#ff00ff] via-[#00e0ff] to-[#ff00ff]"
              style={{ height: '200%' }}
              animate={{
                y: ['-100%', '0%'],
              }}
              transition={{
                repeat: Infinity,
                repeatType: 'loop',
                duration: 4,
                ease: 'linear',
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WalletConnectingOverlay;