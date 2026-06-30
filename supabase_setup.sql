-- ==========================================
-- Supabase Setup Script: Reviews & RBAC
-- Run this script in the Supabase SQL Editor.
-- ==========================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------
-- 1. Profiles Table (Role-Based Access Control)
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Admins have full access to profiles" 
    ON public.profiles FOR ALL 
    USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'))
    WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE POLICY "Users can read their own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

-- ------------------------------------------
-- Helper Function to check user role securely
-- ------------------------------------------
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- ------------------------------------------
-- 2. Automatic Profile Creation Trigger
-- ------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ------------------------------------------
-- 3. Reviews Table
-- ------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL CONSTRAINT name_length CHECK (char_length(full_name) <= 100),
    profession TEXT NOT NULL CONSTRAINT profession_length CHECK (char_length(profession) <= 100),
    company TEXT CONSTRAINT company_length CHECK (company IS NULL OR char_length(company) <= 150),
    service TEXT NOT NULL,
    project_name TEXT,
    rating INTEGER NOT NULL CONSTRAINT rating_bounds CHECK (rating >= 1 AND rating <= 5),
    review TEXT NOT NULL CONSTRAINT review_length CHECK (char_length(review) >= 20 AND char_length(review) <= 1000),
    photo_url TEXT,
    email TEXT,
    approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Reviews Policies
CREATE POLICY "Anyone can submit reviews" 
    ON public.reviews FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Public can read approved reviews, Admins can read all" 
    ON public.reviews FOR SELECT 
    USING (approved = true OR public.get_user_role() = 'admin');

CREATE POLICY "Only admins can edit reviews" 
    ON public.reviews FOR UPDATE 
    USING (public.get_user_role() = 'admin');

CREATE POLICY "Only admins can delete reviews" 
    ON public.reviews FOR DELETE 
    USING (public.get_user_role() = 'admin');

-- ------------------------------------------
-- 4. Indexes for Performance
-- ------------------------------------------
CREATE INDEX IF NOT EXISTS idx_reviews_approved ON public.reviews(approved);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_service ON public.reviews(service);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);

-- ------------------------------------------
-- 5. Updated At Trigger Function
-- ------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW
    EXECUTE PROCEDURE public.update_updated_at_column();

CREATE OR REPLACE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE PROCEDURE public.update_updated_at_column();

-- ------------------------------------------
-- 6. Storage Bucket & Policies
-- ------------------------------------------
-- Create public bucket for review images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-images', 
  'review-images', 
  true, 
  5242880, -- 5 MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for review-images
CREATE POLICY "Public read access to review images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'review-images');

CREATE POLICY "Admins can upload review images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'review-images' AND public.get_user_role() = 'admin');

CREATE POLICY "Admins can delete review images"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'review-images' AND public.get_user_role() = 'admin');
