/*
  # Create Milestone 1 Schema

  1. New Tables
    - `milestones`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key)
      - `name` (text)
      - `description` (text)
      - `due_date` (timestamptz)
      - `completion` (integer)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid, foreign key)

    - `milestone_tasks`
      - `id` (uuid, primary key)
      - `milestone_id` (uuid, foreign key)
      - `name` (text)
      - `description` (text)
      - `weight` (integer)
      - `completion` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  due_date timestamptz,
  completion integer DEFAULT 0,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create milestone tasks table
CREATE TABLE IF NOT EXISTS milestone_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id uuid REFERENCES milestones(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  weight integer DEFAULT 0,
  completion integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestone_tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for milestones
CREATE POLICY "Users can view milestones"
  ON milestones
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert milestones"
  ON milestones
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update milestones"
  ON milestones
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for milestone tasks
CREATE POLICY "Users can view milestone tasks"
  ON milestone_tasks
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert milestone tasks"
  ON milestone_tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update milestone tasks"
  ON milestone_tasks
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create function to update milestone completion
CREATE OR REPLACE FUNCTION update_milestone_completion()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE milestones
  SET completion = (
    SELECT COALESCE(
      ROUND(
        AVG(CAST(completion * weight AS FLOAT) / 100)
      ),
      0
    )
    FROM milestone_tasks
    WHERE milestone_id = NEW.milestone_id
  ),
  updated_at = now()
  WHERE id = NEW.milestone_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update milestone completion
CREATE TRIGGER update_milestone_completion_trigger
AFTER INSERT OR UPDATE OF completion, weight ON milestone_tasks
FOR EACH ROW
EXECUTE FUNCTION update_milestone_completion();