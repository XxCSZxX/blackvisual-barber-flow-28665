-- Fix storage policy to allow root-level uploads in service-images bucket
ALTER POLICY "Admins can upload service images"
ON storage.objects
WITH CHECK (
  bucket_id = 'service-images'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Ensure update/delete policies remain constrained to the bucket and admin role (idempotent redefinitions are not supported with ALTER for USING in Postgres 14 for storage schema specifics, but they are already correct).