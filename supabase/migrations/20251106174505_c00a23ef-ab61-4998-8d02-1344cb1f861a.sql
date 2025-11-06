-- Create products table for consumable items
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  image TEXT,
  category TEXT NOT NULL DEFAULT 'consumivel',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active products" 
ON public.products 
FOR SELECT 
USING (active = true);

CREATE POLICY "Admins can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update products" 
ON public.products 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete products" 
ON public.products 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert some example consumable products
INSERT INTO public.products (name, description, price, category, image) VALUES
('Pomada Modeladora', 'Pomada para modelar e fixar o cabelo', 35.00, 'consumivel', 'https://images.unsplash.com/photo-1621607510769-6422b7e8a0ec?w=400'),
('Shampoo Premium', 'Shampoo hidratante profissional', 45.00, 'consumivel', 'https://images.unsplash.com/photo-1594741158704-5a784b8e59fa?w=400'),
('Óleo para Barba', 'Óleo nutritivo para barba', 28.00, 'consumivel', 'https://images.unsplash.com/photo-1621618313613-2c9e2f8f6635?w=400'),
('Cera Modeladora', 'Cera forte para penteados estruturados', 32.00, 'consumivel', 'https://images.unsplash.com/photo-1621607511021-5e39e1c7a3e5?w=400');