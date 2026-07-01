-- ==============================================================
-- SECTION 1: CREATE OR UPDATE REVIEWS TABLE
-- Stores client reviews with status field.
-- ==============================================================
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name TEXT NOT NULL,
    service_used TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    detailed_review TEXT NOT NULL,
    photo_url TEXT, -- Stores compressed base64 JPEG data URL or direct image URL
    client_profession TEXT, -- Stores client profession/title
    status TEXT DEFAULT 'Pending' NOT NULL CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Migrates legacy "approved" column if it exists in the table from Phase 1
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reviews' AND column_name = 'approved'
    ) THEN
        UPDATE public.reviews SET status = 'Approved' WHERE approved = TRUE;
        UPDATE public.reviews SET status = 'Pending' WHERE approved = FALSE;
        ALTER TABLE public.reviews DROP COLUMN approved;
    END IF;
END $$;

-- ==============================================================
-- SECTION 2: ENABLE ROW LEVEL SECURITY (RLS)
-- Protects the table from unauthorized reads/writes.
-- ==============================================================
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- ==============================================================
-- SECTION 3: RLS POLICIES FOR REVIEWS
-- ==============================================================

-- A. Allow anonymous frontend visitors to insert reviews.
DROP POLICY IF EXISTS "Allow public insert reviews" ON public.reviews;
CREATE POLICY "Allow public insert reviews" 
    ON public.reviews 
    FOR INSERT 
    TO anon, authenticated
    WITH CHECK (true);

-- B. Allow authenticated admin users to read reviews
DROP POLICY IF EXISTS "Allow admin select reviews" ON public.reviews;
CREATE POLICY "Allow admin select reviews" 
    ON public.reviews 
    FOR SELECT 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE public.admin_users.id = auth.uid()
        )
    );

-- C. Allow authenticated admin users to update reviews (status, text, photo changes)
DROP POLICY IF EXISTS "Allow admin update reviews" ON public.reviews;
CREATE POLICY "Allow admin update reviews" 
    ON public.reviews 
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

-- D. Allow authenticated admin users to delete reviews
DROP POLICY IF EXISTS "Allow admin delete reviews" ON public.reviews;
CREATE POLICY "Allow admin delete reviews" 
    ON public.reviews 
    FOR DELETE 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users 
            WHERE public.admin_users.id = auth.uid()
        )
    );

-- E. Allow public anonymous visitors to read APPROVED reviews only
DROP POLICY IF EXISTS "Allow public read approved reviews" ON public.reviews;
CREATE POLICY "Allow public read approved reviews" 
    ON public.reviews 
    FOR SELECT 
    TO anon, authenticated
    USING (status = 'Approved');
