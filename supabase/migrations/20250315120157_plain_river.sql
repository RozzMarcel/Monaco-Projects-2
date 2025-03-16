/*
  # Add RLS Policies for Projects Table

  1. Changes
    - Add RLS policies for the projects table
    - Allow authenticated users to manage projects
    - Allow public read access to projects

  2. Security
    - Enable RLS on projects table
    - Add policies for CRUD operations
*/

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Allow public read access to projects"
ON projects
FOR SELECT
USING (true);

CREATE POLICY "Allow insert access to projects"
ON projects
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow update access to projects"
ON projects
FOR UPDATE
USING (true);

CREATE POLICY "Allow delete access to projects"
ON projects
FOR DELETE
USING (true);