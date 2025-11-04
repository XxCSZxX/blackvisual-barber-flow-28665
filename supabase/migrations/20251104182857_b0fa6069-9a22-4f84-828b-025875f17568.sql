-- Add category column to services table
ALTER TABLE public.services 
ADD COLUMN category text NOT NULL DEFAULT 'corte-masculino';

-- Add check constraint for valid categories
ALTER TABLE public.services
ADD CONSTRAINT services_category_check 
CHECK (category IN ('corte-masculino', 'barba', 'sombrancelha', 'produtos-consumiveis'));