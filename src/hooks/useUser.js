import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Custom hook to safely fetch the current authenticated user from Supabase.
 * Handles the 'Lock' error gracefully and listens for auth state changes.
 */
export const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const { data, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          // Gracefully handle the Supabase Lock/Timeout error
          if (authError.message?.includes('Lock') || authError.name === 'AuthRetryableFetchError') {
            console.warn('useUser: Supabase Auth Lock error encountered. Handling gracefully.', authError.message);
          } else {
            throw authError;
          }
        }

        if (mounted) {
          setUser(data?.user ?? null);
        }
      } catch (err) {
        console.error('useUser: Error fetching user:', err.message);
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    // Listen for auth state changes to keep user state in sync
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, error };
};
