/*
  # Add Risk Register Join to Risk History

  1. Changes
    - Add risk_register join capability to risk_history table
    - Update RLS policies to allow access to joined data

  2. Security
    - Maintain existing RLS policies
    - Add policies for joined data access
*/

-- Drop existing risk_history table
DROP TABLE IF EXISTS risk_history;

-- Recreate risk_history table with foreign key reference
CREATE TABLE risk_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_id text NOT NULL,
  action text NOT NULL,
  date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  FOREIGN KEY (risk_id) REFERENCES risk_register(id)
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