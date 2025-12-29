'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { supabase } from '@/utils/supabase';

type User = {
  id: string;
  email: string;
  fName?: string;
  lName?: string;
};

type AuthContextType = {
  loggedIn: boolean;
  user: User | null;
  setLoggedIn: (val: boolean) => void;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setLoggedIn(true);
        setUser({
          id: session.user.id,
          email: session.user.email!,
        });
      } else {
        setLoggedIn(false);
        setUser(null);
      }

      setInitialized(true);
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setLoggedIn(true);
        setUser({
          id: session.user.id,
          email: session.user.email!,
        });
      } else {
        setLoggedIn(false);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo(
    () => ({ loggedIn, setLoggedIn, user, setUser }),
    [loggedIn, user]
  );

  if (!initialized) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
