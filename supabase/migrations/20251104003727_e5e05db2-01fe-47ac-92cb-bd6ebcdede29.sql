-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Everyone can read active services
CREATE POLICY "Anyone can view active services"
ON public.services FOR SELECT
USING (active = true);

-- Only admins can insert, update, delete services
CREATE POLICY "Admins can insert services"
ON public.services FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update services"
ON public.services FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete services"
ON public.services FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create time_slots table
CREATE TABLE public.time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  time TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;

-- Everyone can read active time slots
CREATE POLICY "Anyone can view active time slots"
ON public.time_slots FOR SELECT
USING (active = true);

-- Only admins can manage time slots
CREATE POLICY "Admins can insert time slots"
ON public.time_slots FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update time slots"
ON public.time_slots FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete time slots"
ON public.time_slots FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Insert initial services data
INSERT INTO public.services (title, description, price, image, slug) VALUES
('Corte Masculino Moderno', 'Corte moderno com técnicas avançadas', 60.00, '/src/assets/corte-masculino.jpg', 'corte-masculino'),
('Degradê Perfeito', 'Degradê com precisão e estilo', 80.00, '/src/assets/degrade-perfeito.jpg', 'degrade-perfeito'),
('Barba VIP', 'Modelagem completa com toalha quente', 40.00, '/src/assets/barba-vip.jpg', 'barba-vip');

-- Insert initial time slots
INSERT INTO public.time_slots (time, display_order) VALUES
('09:00', 1),
('10:00', 2),
('11:00', 3),
('12:00', 4),
('14:00', 5),
('15:00', 6),
('16:00', 7),
('17:00', 8),
('18:00', 9),
('19:00', 10);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();