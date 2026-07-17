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

  // Construct the Edge Function endpoint for send-contact-email
  const endpoint = `${supabaseUrl}/functions/v1/send-contact-email`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    },
    body: JSON.stringify({
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone || null,
      service: formData.service || null,
      message: formData.message
    })
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`HTTP Error ${response.status}: ${errorDetails}`);
  }

  return true;
};

