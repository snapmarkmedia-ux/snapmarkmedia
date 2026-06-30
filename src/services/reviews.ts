import { supabase } from '../lib/supabase';
import { insertRecord, fetchRecords, updateRecord, deleteRecord } from './database';
import { uploadFile, deleteFile, getPublicUrl } from './storage';

const TABLE_NAME = 'reviews';
const BUCKET_NAME = 'review-images';

/**
 * Creates a new customer review (Public)
 */
export const createReview = async (reviewData) => {
  return await insertRecord(TABLE_NAME, reviewData);
};

/**
 * Fetches all approved reviews ordered by newest (Public)
 */
export const fetchApprovedReviews = async () => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('approved', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Fetches all pending (unapproved) reviews (Admin Only)
 */
export const fetchPendingReviews = async () => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('approved', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

/**
 * Approves a review (Admin Only)
 */
export const approveReview = async (id) => {
  return await updateRecord(TABLE_NAME, { id }, { approved: true });
};

/**
 * Rejects/disapproves a review (Admin Only)
 */
export const rejectReview = async (id) => {
  return await updateRecord(TABLE_NAME, { id }, { approved: false });
};

/**
 * Edits a review details (Admin Only)
 */
export const updateReview = async (id, reviewData) => {
  return await updateRecord(TABLE_NAME, { id }, reviewData);
};

/**
 * Deletes a review from the database (Admin Only)
 */
export const deleteReview = async (id) => {
  return await deleteRecord(TABLE_NAME, { id });
};

/**
 * Uploads a review image to the bucket (Admin Only by RLS)
 */
export const uploadReviewImage = async (file) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `images/${fileName}`;

  // Upload file to bucket
  await uploadFile(BUCKET_NAME, filePath, file);

  // Return the public URL
  return getPublicUrl(BUCKET_NAME, filePath);
};

/**
 * Deletes a review image from storage (Admin Only by RLS)
 */
export const deleteReviewImage = async (imageUrl) => {
  // Extract path from public URL
  // Example URL: https://xxx.supabase.co/storage/v1/object/public/review-images/images/xyz.jpg
  const pathParts = imageUrl.split(`/${BUCKET_NAME}/`);
  if (pathParts.length < 2) {
    throw new Error('Invalid review image URL format.');
  }
  const filePath = pathParts[1];

  return await deleteFile(BUCKET_NAME, [filePath]);
};
