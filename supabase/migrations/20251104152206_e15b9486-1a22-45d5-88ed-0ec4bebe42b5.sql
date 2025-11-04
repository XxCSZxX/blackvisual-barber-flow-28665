-- Create storage policies for service-images bucket
-- Allow authenticated admins to upload service images
CREATE POLICY "Admins can upload service images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'service-images' 
  AND (storage.foldername(name))[1] = 'service-images'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow authenticated admins to update service images
CREATE POLICY "Admins can update service images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'service-images'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow authenticated admins to delete service images
CREATE POLICY "Admins can delete service images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'service-images'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow everyone to view service images (public bucket)
CREATE POLICY "Anyone can view service images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'service-images');