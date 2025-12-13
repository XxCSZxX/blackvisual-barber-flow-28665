-- Drop the restrictive SELECT policy that only shows active coupons
DROP POLICY IF EXISTS "Anyone can view active coupons" ON public.discount_coupons;

-- Create a policy that allows admins to view ALL coupons (including inactive ones)
CREATE POLICY "Admins can view all coupons" 
ON public.discount_coupons 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create a separate policy for public users to only see active coupons
CREATE POLICY "Anyone can view active coupons for validation" 
ON public.discount_coupons 
FOR SELECT 
USING (active = true);