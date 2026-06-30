import { supabase } from '../lib/supabase';

/**
 * Supabase Database (CRUD) Helpers
 */

export const fetchRecords = async (tableName, select = '*') => {
  if (!supabase) throw new Error('Supabase client is not initialized. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  const { data, error } = await supabase.from(tableName).select(select);
  if (error) throw error;
  return data;
};

export const insertRecord = async (tableName, payload) => {
  if (!supabase) throw new Error('Supabase client is not initialized. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  const { data, error } = await supabase.from(tableName).insert(payload).select();
  if (error) throw error;
  return data;
};

export const updateRecord = async (tableName, matchCriteria, payload) => {
  if (!supabase) throw new Error('Supabase client is not initialized. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  const { data, error } = await supabase.from(tableName).update(payload).match(matchCriteria).select();
  if (error) throw error;
  return data;
};

export const deleteRecord = async (tableName, matchCriteria) => {
  if (!supabase) throw new Error('Supabase client is not initialized. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  const { data, error } = await supabase.from(tableName).delete().match(matchCriteria).select();
  if (error) throw error;
  return data;
};
