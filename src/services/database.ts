import { supabase } from '../lib/supabase';

/**
 * Supabase Database (CRUD) Helpers
 */

export const fetchRecords = async (tableName, select = '*') => {
  const { data, error } = await supabase.from(tableName).select(select);
  if (error) throw error;
  return data;
};

export const insertRecord = async (tableName, payload) => {
  const { data, error } = await supabase.from(tableName).insert(payload).select();
  if (error) throw error;
  return data;
};

export const updateRecord = async (tableName, matchCriteria, payload) => {
  const { data, error } = await supabase.from(tableName).update(payload).match(matchCriteria).select();
  if (error) throw error;
  return data;
};

export const deleteRecord = async (tableName, matchCriteria) => {
  const { data, error } = await supabase.from(tableName).delete().match(matchCriteria).select();
  if (error) throw error;
  return data;
};
