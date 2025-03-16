/*
  # Create Risk Management Tables

  1. New Tables
    - `risk_register`
      - `id` (text, primary key)
      - `project_id` (text, foreign key)
      - `description` (text)
      - `manager` (text)
      - `severity` (integer)
      - `mitigation` (text)
      - `date` (date)
      - `created_at` (timestamptz)
      - `created_by` (uuid)

    - `risk_history`
      - `id` (uuid, primary key)
      - `risk_id` (text)
      - `action` (text)
      - `date` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create risk register table
CREATE TABLE IF NOT EXISTS risk_register (
  id text PRIMARY KEY,
  project_id text REFERENCES projects(id),
  description text NOT NULL,
  manager text NOT NULL,
  severity integer NOT NULL,
  mitigation text,
  date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create risk history table
CREATE TABLE IF NOT EXISTS risk_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_id text NOT NULL,
  action text NOT NULL,
  date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE risk_register ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_history ENABLE ROW LEVEL SECURITY;

-- Create policies for risk register
CREATE POLICY "Users can view risks"
  ON risk_register
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert risks"
  ON risk_register
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update risks"
  ON risk_register
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete risks"
  ON risk_register
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for risk history
CREATE POLICY "Users can view risk history"
  ON risk_history
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert risk history"
  ON risk_history
  FOR INSERT
  TO authenticated
  WITH CHECK (true);