-- Create barbers table
CREATE TABLE public.barbers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  photo TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;

-- Anyone can view active barbers
CREATE POLICY "Anyone can view active barbers"
ON public.barbers
FOR SELECT
USING (active = true);

-- Admins can manage barbers
CREATE POLICY "Admins can insert barbers"
ON public.barbers
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update barbers"
ON public.barbers
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete barbers"
ON public.barbers
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Add trigger for updated_at
CREATE TRIGGER update_barbers_updated_at
  BEFORE UPDATE ON public.barbers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert Lucas as the first barber
INSERT INTO public.barbers (name, whatsapp, photo, active)
VALUES ('Lucas', '+5562991492590', 'lucas-barber.jpg', true);