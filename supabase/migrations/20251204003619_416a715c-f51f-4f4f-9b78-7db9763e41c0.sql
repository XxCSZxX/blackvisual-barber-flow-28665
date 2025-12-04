-- Drop the overly permissive SELECT policy that exposes customer PII
DROP POLICY IF EXISTS "Anyone can view bookings" ON public.bookings;

-- Create a new policy that only allows admins to view all bookings
CREATE POLICY "Admins can view all bookings" 
ON public.bookings 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));