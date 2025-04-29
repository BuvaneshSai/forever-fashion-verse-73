
-- Create a storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'Products Images', true);

-- Create policy to allow public read access to product images
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'products');

-- Create policy to allow authenticated users to insert objects in products bucket
CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');
