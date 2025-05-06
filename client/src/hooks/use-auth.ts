
import { createContext, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';

// Define the User type
interface User {
  id: number;
  username: string;
  email: string;
  tokenBalance: number;
  isVerified: boolean;
  referralCode: string | null;
  // Add other properties as needed
}

// Define the Auth context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

// Create a context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
});

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use React Query to fetch the user data
  const { data, isLoading, error } = useQuery<User>({
    queryKey: ['/api/user'],
    retry: 1,
    refetchOnWindowFocus: true,
  });

  return (
    <AuthContext.Provider
      value={{
        user: data || null,
        isLoading,
        error: error as Error | null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

