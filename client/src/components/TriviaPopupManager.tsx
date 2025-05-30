import { useState, useEffect } from 'react';
import TriviaPopup from './TriviaPopup';

interface TriviaPopupManagerProps {
  // Time in milliseconds before the popup shows (default: 5 minutes)
  popupInterval?: number;
  // Required time in seconds user needs to be active on page before popup can appear
  minActiveTime?: number;
}

export default function TriviaPopupManager({
  popupInterval = 300000, // 5 minutes in milliseconds
  minActiveTime = 30, // 30 seconds
}: TriviaPopupManagerProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [lastPopupTime, setLastPopupTime] = useState<number>(() => {
    const stored = localStorage.getItem('lastTriviaPopupTime');
    return stored ? parseInt(stored, 10) : 0;
  });
  const [isUserActive, setIsUserActive] = useState(false);
  const [activeTime, setActiveTime] = useState(0);

  // Track user activity
  useEffect(() => {
    let activityTimer: number | null = null;
    let inactiveTimeout: number | null = null;

    const resetInactiveTimeout = () => {
      if (inactiveTimeout) window.clearTimeout(inactiveTimeout);
      setIsUserActive(true);

      inactiveTimeout = window.setTimeout(() => {
        setIsUserActive(false);
      }, 60000); // Mark as inactive after 1 minute of no activity
    };

    // Event listeners for user activity
    const onActivity = () => resetInactiveTimeout();
    window.addEventListener('mousemove', onActivity);
    window.addEventListener('keydown', onActivity);
    window.addEventListener('click', onActivity);
    window.addEventListener('scroll', onActivity);
    window.addEventListener('touchstart', onActivity);

    // Initialize
    resetInactiveTimeout();

    // Increment active time counter
    activityTimer = window.setInterval(() => {
      if (isUserActive) {
        setActiveTime((prev) => prev + 1);
      }
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', onActivity);
      window.removeEventListener('keydown', onActivity);
      window.removeEventListener('click', onActivity);
      window.removeEventListener('scroll', onActivity);
      window.removeEventListener('touchstart', onActivity);
      if (inactiveTimeout) window.clearTimeout(inactiveTimeout);
      if (activityTimer) window.clearInterval(activityTimer);
    };
  }, [isUserActive]);

  // Check if it's time to show the popup
  useEffect(() => {
    // Don't show popup if one is already showing
    if (showPopup) return;

    // Only show popup if user has been active for the minimum time
    if (activeTime < minActiveTime) return;

    const currentTime = Date.now();
    const timeElapsed = currentTime - lastPopupTime;

    // If enough time has passed since the last popup
    if (timeElapsed >= popupInterval) {
      const randomDelay = Math.floor(Math.random() * 20000) + 5000; // Random delay between 5-25 seconds

      const popupTimer = setTimeout(() => {
        setShowPopup(true);
        setLastPopupTime(currentTime);
        localStorage.setItem('lastTriviaPopupTime', currentTime.toString());
      }, randomDelay);

      return () => clearTimeout(popupTimer);
    }
  }, [activeTime, lastPopupTime, minActiveTime, popupInterval, showPopup]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return showPopup ? <TriviaPopup onClose={handleClosePopup} /> : null;
}
