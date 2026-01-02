-- Add duration_slots column to services table
-- This indicates how many 30-minute slots the service occupies (1 = 30min, 2 = 60min, etc.)
ALTER TABLE public.services 
ADD COLUMN duration_slots integer NOT NULL DEFAULT 1;

-- Update combo services to use 2 slots (assuming combos take 60 minutes)
UPDATE public.services 
SET duration_slots = 2 
WHERE category = 'combo';