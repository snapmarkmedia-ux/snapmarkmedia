/**
 * contact.js - Supabase Contact Form Backend Integration
 * Uses vanilla fetch to submit form data directly to Supabase REST API.
 * This avoids client SDK Authorization header issues with the new sb_publishable keys.
 */

window.submitContactForm = async function(formData) {
  const supabaseUrl = 'https://amzrzysnwbfnldnyricg.supabase.co';
  const supabaseAnonKey = 'sb_publishable_f6yhgk7fBqV46E872LyKEg__mQfkTKk';

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing.');
  }

  // Construct the direct REST API endpoint for the contact_submissions table
  const endpoint = `${supabaseUrl}/rest/v1/contact_submissions`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'apikey': supabaseAnonKey,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone || null,
      service: formData.service || null,
      message: formData.message,
      status: 'new'
    })
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`HTTP Error ${response.status}: ${errorDetails}`);
  }

  return true;
};
