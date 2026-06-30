import { supabase } from '../lib/supabase';

/**
 * Supabase Authentication Helpers
 */

export const signUp = async (email, password) => {
  if (!supabase) throw new Error('Supabase client is not initialized. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
};

export const signIn = async (email, password) => {
  if (!supabase) throw new Error('Supabase client is not initialized. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  if (!supabase) throw new Error('Supabase client is not initialized. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getSession = async () => {
  if (!supabase) throw new Error('Supabase client is not initialized. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

export const onAuthStateChange = (callback) => {
  if (!supabase) return () => {};
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};
