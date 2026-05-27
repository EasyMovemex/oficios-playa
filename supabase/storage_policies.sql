DROP POLICY IF EXISTS "Prestadores suben sus imagenes" ON storage.objects;
CREATE POLICY "Prestadores suben sus imagenes" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'provider-assets');

DROP POLICY IF EXISTS "Lectura publica de provider-assets" ON storage.objects;
CREATE POLICY "Lectura publica de provider-assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'provider-assets');

DROP POLICY IF EXISTS "Prestadores eliminan sus imagenes" ON storage.objects;
CREATE POLICY "Prestadores eliminan sus imagenes" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'provider-assets'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
