-- Recreate the update policy for products with proper permissions
DROP POLICY IF EXISTS "Admins can update products" ON public.products;

CREATE POLICY "Admins can update products" 
ON public.products 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));