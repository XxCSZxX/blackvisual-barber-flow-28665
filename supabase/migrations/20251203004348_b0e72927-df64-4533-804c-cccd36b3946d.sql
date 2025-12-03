-- Create junction table for barber-specific time slots
CREATE TABLE public.barber_time_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id uuid NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  time_slot_id uuid NOT NULL REFERENCES public.time_slots(id) ON DELETE CASCADE,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(barber_id, time_slot_id)
);

-- Enable RLS
ALTER TABLE public.barber_time_slots ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active barber time slots"
ON public.barber_time_slots
FOR SELECT
USING (active = true);

CREATE POLICY "Admins can insert barber time slots"
ON public.barber_time_slots
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update barber time slots"
ON public.barber_time_slots
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete barber time slots"
ON public.barber_time_slots
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));