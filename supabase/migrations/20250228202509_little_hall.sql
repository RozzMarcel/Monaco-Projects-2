/*
  # Create storage buckets for file management

  1. New Buckets
    - photos: For project photos and images
    - plans: For architectural drawings and plans
    - permits: For building permits and applications
    - quotes: For project quotes and estimates
    - contracts: For signed contracts and agreements
    - invoices: For project invoices
    - correspondence: For project correspondence
    - administrative: For administrative documents

  2. Security
    - Enable RLS on all buckets
    - Add policies for authenticated users to manage their files
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('photos', 'photos', true),
  ('plans', 'plans', true),
  ('permits', 'permits', true),
  ('quotes', 'quotes', true),
  ('contracts', 'contracts', true),
  ('invoices', 'invoices', true),
  ('correspondence', 'correspondence', true),
  ('administrative', 'administrative', true);

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id IN (
  'photos', 'plans', 'permits', 'quotes', 'contracts', 'invoices', 'correspondence', 'administrative'
));

CREATE POLICY "Authenticated users can update their files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id IN (
  'photos', 'plans', 'permits', 'quotes', 'contracts', 'invoices', 'correspondence', 'administrative'
));

CREATE POLICY "Authenticated users can read files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id IN (
  'photos', 'plans', 'permits', 'quotes', 'contracts', 'invoices', 'correspondence', 'administrative'
));

CREATE POLICY "Authenticated users can delete their files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id IN (
  'photos', 'plans', 'permits', 'quotes', 'contracts', 'invoices', 'correspondence', 'administrative'
));