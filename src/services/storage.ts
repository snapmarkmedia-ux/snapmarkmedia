import { supabase } from '../lib/supabase';

/**
 * Supabase Storage Helpers
 */

export const uploadFile = async (bucketName, path, file, options = {}) => {
  const { data, error } = await supabase.storage.from(bucketName).upload(path, file, options);
  if (error) throw error;
  return data;
};

export const downloadFile = async (bucketName, path) => {
  const { data, error } = await supabase.storage.from(bucketName).download(path);
  if (error) throw error;
  return data;
};

export const deleteFile = async (bucketName, paths) => {
  const { data, error } = await supabase.storage.from(bucketName).remove(paths);
  if (error) throw error;
  return data;
};

export const getPublicUrl = (bucketName, path) => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
  return data.publicUrl;
};
