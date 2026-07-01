-- ==============================================================
-- SQL Script for Admin Account Creation Restrictions & RLS Policies
-- Run this directly in the Supabase SQL Editor
-- ==============================================================

-- 1. Create public.admin_users table linked to auth.users
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Enable Row Level Security (RLS) on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- 3. Policy to allow public to view admin list (used to detect if registration is locked)
CREATE POLICY "Allow public read admin_users" 
    ON public.admin_users 
    FOR SELECT 
    TO anon, authenticated
    USING (true);

-- 4. Enable RLS on contact_submissions (re-confirming)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- 5. Clear legacy/conflicting policies (except the insert policy)
DROP POLICY IF EXISTS "Allow admin select" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow admin update" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow admin delete" ON public.contact_submissions;

-- 6. Add secure policies for authenticated admin users on contact_submissions

-- Authenticated admins can view all submissions
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

-- Authenticated admins can update status or fields
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

-- Authenticated admins can delete submissions
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

-- 7. Function and Trigger to restrict registration to ONE admin user only

CREATE OR REPLACE FUNCTION public.handle_new_admin()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if there is already at least one admin
    IF (SELECT COUNT(*) FROM public.admin_users) >= 1 THEN
        RAISE EXCEPTION 'Registration is permanently disabled. An administrator account already exists.';
    END IF;

    -- Store the admin user details in public.admin_users
    INSERT INTO public.admin_users (id, email)
    VALUES (new.id, new.email);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_admin();
