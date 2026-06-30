import { supabase } from '../lib/supabase';

/**
 * Supabase Storage Helpers
 */

export const uploadFile = async (bucketName, path, file, options = {}) => {
  if (!supabase) throw new Error('Supabase client is not initialized. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  const { data, error } = await supabase.storage.from(bucketName).upload(path, file, options);
  if (error) throw error;
  return data;
};

export const downloadFile = async (bucketName, path) => {
  if (!supabase) throw new Error('Supabase client is not initialized. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  const { data, error } = await supabase.storage.from(bucketName).download(path);
  if (error) throw error;
  return data;
};

export const deleteFile = async (bucketName, paths) => {
  if (!supabase) throw new Error('Supabase client is not initialized. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  const { data, error } = await supabase.storage.from(bucketName).remove(paths);
  if (error) throw error;
  return data;
};

export const getPublicUrl = (bucketName, path) => {
  if (!supabase) return '';
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
  return data.publicUrl;
};
