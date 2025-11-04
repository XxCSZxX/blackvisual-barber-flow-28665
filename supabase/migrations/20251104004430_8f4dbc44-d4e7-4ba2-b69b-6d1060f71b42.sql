-- Create function to automatically make first user an admin
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if this is the first user
  IF (SELECT COUNT(*) FROM auth.users) <= 1 THEN
    -- Make first user an admin
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    -- Make subsequent users regular users
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger to auto-assign roles on signup
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_role();

-- Update image paths in services to use correct format
UPDATE public.services 
SET image = CASE slug
  WHEN 'corte-masculino' THEN 'corte-masculino.jpg'
  WHEN 'degrade-perfeito' THEN 'degrade-perfeito.jpg'
  WHEN 'barba-vip' THEN 'barba-vip.jpg'
  ELSE image
END;