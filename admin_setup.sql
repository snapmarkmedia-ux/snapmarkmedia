-- ==============================================================
-- SECTION 1: CREATE ADMIN PROFILE TABLE
-- Creates the metadata table for admin users if it doesn't exist.
-- It links directly to Supabase's auth.users table.
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==============================================================
-- SECTION 2: ENABLE ROW LEVEL SECURITY (RLS)
-- Ensures database tables are guarded by security policies.
-- ==============================================================
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- ==============================================================
-- SECTION 3: RLS POLICY FOR ADMIN_USERS
-- Allows anonymous frontend page visitors to query if an admin profile 
-- exists (needed to hide/show the "Setup Admin" signup option).
-- ==============================================================
DROP POLICY IF EXISTS "Allow public read admin_users" ON public.admin_users;
CREATE POLICY "Allow public read admin_users" 
    ON public.admin_users 
    FOR SELECT 
    TO anon, authenticated
    USING (true);

-- ==============================================================
-- SECTION 4: RLS POLICIES FOR CONTACT_SUBMISSIONS
-- Grants read, update, and delete access ONLY to authenticated users
-- who are registered in our admin_users profile table.
-- NOTE: We do NOT touch the public INSERT policy, preserving it completely.
-- ==============================================================
DROP POLICY IF EXISTS "Allow admin select" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow admin update" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow admin delete" ON public.contact_submissions;

-- A. Allow authenticated admin users to read submissions
CREATE POLICY "Allow admin select" 
    ON public.contact_submissions 
    FOR SELECT 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE public.admin_users.id = auth.uid()
        )
    );

-- B. Allow authenticated admin users to update submissions (status changes)
CREATE POLICY "Allow admin update" 
    ON public.contact_submissions 
    FOR UPDATE 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE public.admin_users.id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE public.admin_users.id = auth.uid()
        )
    );

-- C. Allow authenticated admin users to delete submissions
CREATE POLICY "Allow admin delete" 
    ON public.contact_submissions 
    FOR DELETE 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE public.admin_users.id = auth.uid()
        )
    );

-- ==============================================================
-- SECTION 5: ONE-TIME ADMIN REGISTRATION TRIGGER
-- Enforces a strict one-admin limit. When a new user registers in Supabase Auth,
-- this database function automatically verifies if an admin already exists.
-- If an admin exists, it raises an exception, aborting the signup.
-- If no admin exists, it creates the profile.
-- ==============================================================
CREATE OR REPLACE FUNCTION public.handle_new_admin()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if there is already at least one admin profile
    IF (SELECT COUNT(*) FROM public.admin_users) >= 1 THEN
        RAISE EXCEPTION 'Registration is permanently disabled. An administrator account already exists.';
    END IF;

    -- Store the admin user details in public.admin_users
    INSERT INTO public.admin_users (id, email)
    VALUES (new.id, new.email);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind the function to run after insert on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_admin();
