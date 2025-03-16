/*
  # Update Risk History Schema

  1. Changes
    - Drop and recreate risk_history table with ON DELETE CASCADE
    - Add project_id column to risk_history
    - Add metadata column for storing additional info

  2. Security
    - Maintain existing RLS policies
*/

-- Drop existing risk_history table
DROP TABLE IF EXISTS risk_history;

-- Recreate risk_history table with CASCADE and additional columns
CREATE TABLE risk_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_id text NOT NULL,
  project_id text REFERENCES projects(id),
  action text NOT NULL,
  date timestamptz NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  FOREIGN KEY (risk_id) REFERENCES risk_register(id) ON DELETE CASCADE
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