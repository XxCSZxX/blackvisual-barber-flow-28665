-- Criar enum para roles
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'user');
    END IF;
END $$;

-- Criar tabela user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Habilitar RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Políticas básicas
CREATE POLICY "allow_select_own" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "allow_insert_first_admin" ON public.user_roles FOR INSERT WITH CHECK (NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin'));