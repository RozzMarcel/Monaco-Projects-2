/*
  # Update Risk Register Schema for Risk Matrix

  1. Changes
    - Add impact and probability columns
    - Remove severity column (will be calculated)
    - Update existing table structure

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns
ALTER TABLE risk_register
  ADD COLUMN impact integer NOT NULL DEFAULT 1,
  ADD COLUMN probability integer NOT NULL DEFAULT 1;

-- Remove old severity column
ALTER TABLE risk_register DROP COLUMN severity;