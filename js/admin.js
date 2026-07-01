/**
 * js/admin.js - Common Admin Panel Services and Authentication Logic
 */

const supabaseUrl = 'https://amzrzysnwbfnldnyricg.supabase.co';
const supabaseAnonKey = 'sb_publishable_f6yhgk7fBqV46E872LyKEg__mQfkTKk';

// Create Supabase client
const supabaseClient = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseAnonKey) : null;

if (!supabaseClient) {
  console.error('Supabase CDN client not loaded. Ensure the CDN script is included before this script.');
}

/**
 * Checks if an administrator account has already been registered.
 * @returns {Promise<boolean>}
 */
async function checkAdminExists() {
  try {
    const { data, error } = await supabaseClient
      .from('admin_users')
      .select('id', { count: 'exact', head: false });
    
    if (error) throw error;
    return data && data.length > 0;
  } catch (err) {
    console.error('Error checking admin presence:', err);
    // Default to true to prevent accidental registration leaks on failure
    return true;
  }
}

async function signUpAdmin(email, password) {
  // First, verify client-side that no admin exists
  const exists = await checkAdminExists();
  if (exists) {
    throw new Error('Registration is permanently disabled. An administrator account already exists.');
  }

  // 1. Sign up the user in Supabase Auth
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) throw error;

  const user = data.user;
  if (!user) {
    throw new Error('Sign up succeeded but no user data was returned.');
  }

  // 2. Insert into the public.admin_users metadata table
  const { error: insertError } = await supabaseClient
    .from('admin_users')
    .insert([
      {
        id: user.id,
        email: user.email
      }
    ]);

  if (insertError) {
    throw insertError;
  }

  return data;
}

/**
 * Signs in the administrator.
 * @param {string} email 
 * @param {string} password 
 */
async function signInAdmin(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

/**
 * Signs out the current administrator.
 */
async function signOutAdmin() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) throw error;
}

/**
 * Retrieves the current user session.
 * @returns {Promise<Object|null>}
 */
async function getCurrentSession() {
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) return null;
  return data.session;
}

/**
 * Fetches all contact submissions.
 * @returns {Promise<Array>}
 */
async function fetchSubmissions() {
  const { data, error } = await supabaseClient
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Updates the status of a contact submission.
 * @param {string} id 
 * @param {string} status 
 */
async function updateSubmissionStatus(id, status) {
  const { error } = await supabaseClient
    .from('contact_submissions')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}

/**
 * Deletes a contact submission.
 * @param {string} id 
 */
async function deleteSubmission(id) {
  const { error } = await supabaseClient
    .from('contact_submissions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Bind to window for global access in script files
window.adminService = {
  checkAdminExists,
  signUpAdmin,
  signInAdmin,
  signOutAdmin,
  getCurrentSession,
  fetchSubmissions,
  updateSubmissionStatus,
  deleteSubmission
};
