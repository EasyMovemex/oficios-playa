DROP POLICY IF EXISTS "Upload provider assets" ON storage.objects;
DROP POLICY IF EXISTS "Prestadores suben sus imagenes" ON storage.objects;

CREATE POLICY "Upload provider assets" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'provider-assets');

CREATE POLICY "Update provider assets" ON storage.objects
  FOR UPDATE USING (bucket_id = 'provider-assets');
