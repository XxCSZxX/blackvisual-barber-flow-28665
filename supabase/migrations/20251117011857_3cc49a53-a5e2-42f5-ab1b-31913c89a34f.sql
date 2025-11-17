-- Fix RLS policy for products table updates
DROP POLICY IF EXISTS "Admins can update products" ON public.products;

CREATE POLICY "Admins can update products" 
ON public.products 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));