-- Bootstrap admin helper functions
create or replace function public.any_admin_exists()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where role = 'admin'::app_role
  );
$$;

revoke all on function public.any_admin_exists() from public;
grant execute on function public.any_admin_exists() to authenticated;

create or replace function public.claim_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  has_admin boolean;
  uid uuid;
begin
  uid := auth.uid();
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  select exists (select 1 from public.user_roles where role = 'admin'::app_role) into has_admin;

  if has_admin then
    raise exception 'Admin already exists';
  end if;

  insert into public.user_roles (user_id, role) values (uid, 'admin'::app_role);
  return true;
end;
$$;

revoke all on function public.claim_admin() from public;
grant execute on function public.claim_admin() to authenticated;