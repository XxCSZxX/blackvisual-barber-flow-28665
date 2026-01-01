-- Drop existing category constraint
ALTER TABLE public.services DROP CONSTRAINT services_category_check;

-- Add new constraint including 'depilacao'
ALTER TABLE public.services ADD CONSTRAINT services_category_check 
CHECK (category = ANY (ARRAY['corte-masculino'::text, 'barba'::text, 'sombrancelha'::text, 'produtos-consumiveis'::text, 'depilacao'::text]));