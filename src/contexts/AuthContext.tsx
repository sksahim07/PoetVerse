import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/db/supabase';
import { getUserCredits } from '@/db/api';

interface AuthContextType {
  user: User | null;
  credits: number | null;
  loading: boolean;
  refreshCredits: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // ক্রেডিট ফেচ করার লজিক 
  const fetchUserCredits = async (userId: string) => {
    try {
      const c = await getUserCredits(userId);
      setCredits(c !== undefined && c !== null ? c : 0);
    } catch (error) {
      console.error('Error fetching credits:', error);
      setCredits(0);
    }
  };

  const refreshCredits = async () => {
    if (user) await fetchUserCredits(user.id);
  };

  // ১. শুধুমাত্র অথেনটিকেশন সেটআপ (এটা একবারই চলবে)
  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        const currentUser = session?.user ?? null;
        if (isMounted) setUser(currentUser);
        if (isMounted) setLoading(false);

        if (currentUser && isMounted) {
          fetchUserCredits(currentUser.id);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) setLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      if (isMounted) {
        setUser(currentUser);
        setLoading(false); 
        
        if (currentUser) {
          fetchUserCredits(currentUser.id);
        } else {
          setCredits(null);
        }
      }
    });

    const safetyTimeout = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 3000);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []); 

  // 🔴 ২. দ্য ফিক্স: ইভেন্ট লিসেনারের জন্য আলাদা useEffect (যেটা লেটেস্ট user-কে চিনতে পারবে)
  useEffect(() => {
    const handleCreditUpdate = () => {
      if (user?.id) {
        fetchUserCredits(user.id);
      }
    };

    window.addEventListener('creditsUpdated', handleCreditUpdate);
    
    return () => {
      window.removeEventListener('creditsUpdated', handleCreditUpdate);
    };
  }, [user]); // 👈 ডিপেন্ডেন্সি হিসেবে 'user' দেওয়া হলো, তাই এটা আর Stale হবে না।

  return (
    <AuthContext.Provider value={{ user, credits, loading, refreshCredits }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};