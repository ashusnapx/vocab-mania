-- Run this in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)
-- It adds an INSERT policy for the words table and seeds all 150 words.

-- 1. Allow inserts (for seeding; words table is trusted static data)
CREATE POLICY "Anyone can insert words"
  ON public.words FOR INSERT
  WITH CHECK (true);
