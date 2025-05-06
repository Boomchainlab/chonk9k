import React, { createContext, useContext, useState } from 'react';

type ToastVariant = 'default' | 'destructive' | 'success';

interface ToastProps {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toast: (props: ToastProps) => void;
  dismissToast: () => void;
  isVisible: boolean;
  currentToast: ToastProps | null;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentToast, setCurrentToast] = useState<ToastProps | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const dismissToast = () => {
    setIsVisible(false);
    if (timeoutId) clearTimeout(timeoutId);
  };

  const toast = (props: ToastProps) => {
    // Clear any existing timeout
    if (timeoutId) clearTimeout(timeoutId);

    // Set the new toast
    setCurrentToast(props);
    setIsVisible(true);

    // Auto-dismiss after duration
    const newTimeoutId = setTimeout(() => {
      dismissToast();
    }, props.duration || 5000);

    setTimeoutId(newTimeoutId);
  };

  return (
    <ToastContext.Provider value={{ toast, dismissToast, isVisible, currentToast }}>
      {children}
      {isVisible && currentToast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div 
            className={`p-4 rounded-lg shadow-lg ${
              currentToast.variant === 'destructive' ? 'bg-red-600 text-white' : 
              currentToast.variant === 'success' ? 'bg-green-600 text-white' : 
              'bg-white text-black'
            }`}
          >
            {currentToast.title && <h4 className="font-medium">{currentToast.title}</h4>}
            {currentToast.description && <p className="mt-1">{currentToast.description}</p>}
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
