import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we are currently in an OAuth redirect flow
    const isOAuthRedirect = window.location.hash.includes('access_token=') || window.location.hash.includes('error=');

    // Use getUser() instead of getSession() to securely validate the token with the Supabase server
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error) {
        console.error('Error getting user:', error);
        setUser(null);
        setProfile(null);
        if (!isOAuthRedirect) {
          setIsLoading(false);
        }
        return;
      }
      
      setUser(user);
      if (user) {
        fetchProfile(user.id);
      } else if (!isOAuthRedirect) {
        setIsLoading(false);
      }
    }).catch(err => {
      console.error('Unexpected error in getUser:', err);
      if (!isOAuthRedirect) {
        setIsLoading(false);
      }
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          // If the hash still contains the token, Supabase hasn't finished parsing it yet.
          // Wait for the next event instead of prematurely stopping the loading state.
          if (!window.location.hash.includes('access_token=') && !window.location.hash.includes('error=')) {
            setIsLoading(false);
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (!error && data) {
        setProfile(data);
      } else if (error) {
        console.error('Error fetching profile:', error);
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setUser(null);
      setProfile(null);
      // Fallback: forcefully clear local storage tokens if Supabase gets stuck
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
          localStorage.removeItem(key);
        }
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
