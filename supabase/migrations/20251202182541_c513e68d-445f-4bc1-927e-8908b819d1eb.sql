-- Remover as policies duplicadas/restritivas
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "allow_select_own" ON public.user_roles;

-- Criar uma policy PERMISSIVE para usuários verem suas próprias roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());