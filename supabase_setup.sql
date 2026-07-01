-- ==============================================================
-- SQL Script for creating contact_submissions table and configuring RLS
-- Run this directly in the Supabase SQL Editor
-- ==============================================================

-- 1. Create the contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Allow anyone (anonymous public visitors) to submit contact forms
CREATE POLICY "Allow public inserts" 
    ON public.contact_submissions 
    FOR INSERT 
    TO anon 
    WITH CHECK (true);

-- Note: Anonymous users are automatically restricted from SELECTing, 
-- UPDATEing, or DELETEing rows as no policies grant those permissions.
