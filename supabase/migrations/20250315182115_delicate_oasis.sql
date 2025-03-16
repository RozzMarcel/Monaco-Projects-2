/*
  # Update RLS policies for public access

  1. Changes
    - Update RLS policies to allow public access to all tables
    - Remove authentication requirements from existing policies
    - Add new public policies where needed

  2. Security
    - Enable public access for data entry
    - Maintain RLS structure for future use
*/

-- Update risk register policies
DROP POLICY IF EXISTS "Users can view risks" ON risk_register;
DROP POLICY IF EXISTS "Users can insert risks" ON risk_register;
DROP POLICY IF EXISTS "Users can update risks" ON risk_register;
DROP POLICY IF EXISTS "Users can delete risks" ON risk_register;

CREATE POLICY "Allow public access to risks"
  ON risk_register
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Update risk history policies
DROP POLICY IF EXISTS "Users can view risk history" ON risk_history;
DROP POLICY IF EXISTS "Users can insert risk history" ON risk_history;

CREATE POLICY "Allow public access to risk history"
  ON risk_history
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Update milestone policies
DROP POLICY IF EXISTS "Users can view milestones" ON milestones;
DROP POLICY IF EXISTS "Users can insert milestones" ON milestones;
DROP POLICY IF EXISTS "Users can update milestones" ON milestones;

CREATE POLICY "Allow public access to milestones"
  ON milestones
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Update milestone tasks policies
DROP POLICY IF EXISTS "Users can view milestone tasks" ON milestone_tasks;
DROP POLICY IF EXISTS "Users can insert milestone tasks" ON milestone_tasks;
DROP POLICY IF EXISTS "Users can update milestone tasks" ON milestone_tasks;

CREATE POLICY "Allow public access to milestone tasks"
  ON milestone_tasks
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Update storage policies
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete their files" ON storage.objects;

CREATE POLICY "Allow public access to files"
  ON storage.objects
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);