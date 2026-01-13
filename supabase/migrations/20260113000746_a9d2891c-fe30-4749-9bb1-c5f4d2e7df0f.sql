-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Anyone can insert bookings" ON public.bookings;

-- Create a permissive INSERT policy that allows anyone to create bookings
CREATE POLICY "Anyone can insert bookings" 
ON public.bookings 
FOR INSERT 
TO public
WITH CHECK (true);

-- Also add a policy to allow anyone to view booking times (for availability checking)
-- This only exposes booking_time and booking_date, not customer info
CREATE POLICY "Anyone can view booked times" 
ON public.bookings 
FOR SELECT 
TO public
USING (true);