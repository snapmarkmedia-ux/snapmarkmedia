/**
 * contact.js - Supabase Contact Form Backend Integration
 * Handles initialization of Supabase client and provides submission API.
 */

// Initialize Supabase Client
const supabaseUrl = 'https://amzrzysnwbfnldnyricg.supabase.co';
const supabaseAnonKey = 'sb_publishable_f6yhgk7fBqV46E872LyKEg__mQfkTKk';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration missing.');
}

// Create the global Supabase client instance
const supabaseClient = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseAnonKey) : null;

/**
 * Submits the contact form data to the Supabase database.
 * 
 * @param {Object} formData 
 * @param {string} formData.fullName
 * @param {string} formData.email
 * @param {string} formData.phone
 * @param {string} formData.service
 * @param {string} formData.message
 * @returns {Promise<Object>}
 */
window.submitContactForm = async function(formData) {
  if (!supabaseClient) {
    throw new Error('Supabase client is not initialized. Please ensure the Supabase CDN script is loaded.');
  }

  const { data, error } = await supabaseClient
    .from('contact_submissions')
    .insert([
      {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone || null,
        service: formData.service || null,
        message: formData.message,
        status: 'new'
      }
    ])
    .select(); // returns inserted row

  if (error) {
    throw error;
  }

  return data;
};
