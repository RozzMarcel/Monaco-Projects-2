/*
  # Add Risk Status Management

  1. Changes
    - Add status column to risk_register table
    - Add resolved_at and resolved_by columns
    - Add resolved_notes column for resolution details

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns to risk_register
ALTER TABLE risk_register
  ADD COLUMN status text DEFAULT 'active',
  ADD COLUMN resolved_at timestamptz,
  ADD COLUMN resolved_by uuid REFERENCES auth.users(id),
  ADD COLUMN resolved_notes text;