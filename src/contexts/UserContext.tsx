import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface User {
  name: string;
  email: string;
  picture: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { user: authUser } = useAuth();

  // Initialize user state from localStorage and sync with auth state
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Sync with auth state
  useEffect(() => {
    if (authUser) {
      // Get user's name and generate initials
      const userName = authUser.user_metadata?.name || '';
      const initials = userName
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      // Create user object with professional styling
      const userObj: User = {
        name: userName,
        email: authUser.email || '',
        picture: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || `https://ui-avatars.com/api/?name=${initials || 'U'}&background=8B5CF6&color=fff&bold=true&length=2&rounded=true`
      };
      handleSetUser(userObj);
    } else {
      handleSetUser(null);
    }
  }, [authUser]);

  // Update localStorage when user state changes
  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser: handleSetUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 