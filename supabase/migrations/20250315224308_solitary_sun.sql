/*
  # Clear Risk Tables and Reset IDs

  1. Changes
    - Delete all records from risk_register and risk_history tables
    - Reset ID sequence for risk_register
    - Clean start with R001 numbering

  2. Security
    - Maintain existing RLS policies
*/

-- Clear all records from risk tables
DELETE FROM risk_history;
DELETE FROM risk_register;

-- Create a function to ensure IDs start from R001
CREATE OR REPLACE FUNCTION generate_risk_id()
RETURNS text AS $$
DECLARE
  next_num integer;
  next_id text;
BEGIN
  -- Get the current max ID number
  SELECT COALESCE(MAX(NULLIF(REGEXP_REPLACE(id, '\D', '', 'g'), '')::integer), 0)
  INTO next_num
  FROM risk_register;
  
  -- Increment and format
  next_num := next_num + 1;
  next_id := 'R' || LPAD(next_num::text, 3, '0');
  
  RETURN next_id;
END;
$$ LANGUAGE plpgsql;