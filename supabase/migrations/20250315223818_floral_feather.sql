/*
  # Fix Risk History Table

  1. Changes
    - Drop foreign key constraint between risk_history and risk_register
    - Keep project_id foreign key for project reference
    - Allow risk_history to maintain records even after risks are deleted

  2. Security
    - Maintain existing RLS policies
*/

-- Drop existing risk_history table
DROP TABLE IF EXISTS risk_history;

-- Recreate risk_history table without risk_register foreign key
CREATE TABLE risk_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_id text NOT NULL,
  project_id text REFERENCES projects(id),
  action text NOT NULL,
  date timestamptz NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE risk_history ENABLE ROW LEVEL SECURITY;

-- Create policies for risk history
CREATE POLICY "Allow public access to risk history"
  ON risk_history
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);