-- ==============================================================
-- SQL Script to enable Database Webhook on contact_submissions
-- Run this directly in the Supabase SQL Editor
-- ==============================================================

-- 1. Enable pg_net extension (required for outbound HTTP requests from database)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Create the Database Webhook Trigger
-- This calls the send-contact-email Edge Function automatically on every INSERT
CREATE OR REPLACE TRIGGER tr_on_contact_submission_insert
AFTER INSERT ON public.contact_submissions
FOR EACH ROW
EXECUTE FUNCTION supabase_functions.http_request(
  'https://amzrzysnwbfnldnyricg.supabase.co/functions/v1/send-contact-email',
  'POST',
  '{"Content-Type":"application/json", "apikey":"sb_publishable_f6yhgk7fBqV46E872LyKEg__mQfkTKk", "Authorization":"Bearer sb_publishable_f6yhgk7fBqV46E872LyKEg__mQfkTKk"}',
  '{}',
  '5000'
);
