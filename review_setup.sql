-- ==============================================================
-- SECTION 1: CREATE REVIEWS TABLE
-- Stores client reviews before admin approval/moderation.
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name TEXT NOT NULL,
    service_used TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    detailed_review TEXT NOT NULL,
    photo_url TEXT, -- Stores compressed base64 JPEG data URL or direct image URL
    approved BOOLEAN DEFAULT FALSE NOT NULL, -- Set to FALSE by default (for future admin approval phase)
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ==============================================================
-- SECTION 2: ENABLE ROW LEVEL SECURITY (RLS)
-- Protects the table from unauthorized reads/writes.
-- ==============================================================
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- ==============================================================
-- SECTION 3: RLS POLICY
-- Allows anonymous frontend visitors to insert reviews.
-- ==============================================================
DROP POLICY IF EXISTS "Allow public insert reviews" ON public.reviews;
CREATE POLICY "Allow public insert reviews" 
    ON public.reviews 
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);
