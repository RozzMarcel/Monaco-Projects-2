/*
  # Add Project Schedule Schema

  1. New Tables
    - `schedule_milestones`
      - `id` (uuid, primary key)
      - `project_id` (text, foreign key)
      - `name` (text)
      - `due_date` (date)
      - `actual_date` (date)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for public access
*/

-- Create schedule milestones table
CREATE TABLE IF NOT EXISTS schedule_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id text REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  due_date date NOT NULL,
  actual_date date,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE schedule_milestones ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "Allow public access to schedule milestones"
  ON schedule_milestones
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Add some initial test data
INSERT INTO schedule_milestones (project_id, name, due_date, actual_date, status)
VALUES
  ('slot-1', 'Project Start', '2024-01-15', '2024-01-15', 'completed'),
  ('slot-1', 'Design Phase Complete', '2024-03-01', '2024-03-05', 'completed'),
  ('slot-1', 'Permits Obtained', '2024-04-15', NULL, 'pending'),
  ('slot-1', 'Construction Start', '2024-05-01', NULL, 'pending'),
  ('slot-1', 'Foundation Complete', '2024-06-15', NULL, 'pending'),
  ('slot-1', 'Structure Complete', '2024-08-30', NULL, 'pending'),
  ('slot-1', 'Project Handover', '2024-12-15', NULL, 'pending');