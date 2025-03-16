/*
  # Update Projects Table ID Type

  1. Changes
    - Modify projects table to use text IDs instead of UUIDs
    - Update foreign key references to use text IDs
    - Preserve existing RLS policies

  2. Security
    - Maintain existing RLS policies
    - Update foreign key constraints
*/

-- Temporarily disable RLS
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE activity_events DISABLE ROW LEVEL SECURITY;

-- Drop foreign key constraints
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_project_id_fkey;
ALTER TABLE comments DROP CONSTRAINT IF EXISTS comments_project_id_fkey;
ALTER TABLE activity_events DROP CONSTRAINT IF EXISTS activity_events_project_id_fkey;
ALTER TABLE milestones DROP CONSTRAINT IF EXISTS milestones_project_id_fkey;

-- Change projects.id type to text
ALTER TABLE projects 
  ALTER COLUMN id TYPE text,
  ALTER COLUMN id SET DEFAULT NULL;

-- Update foreign key columns to text
ALTER TABLE tasks ALTER COLUMN project_id TYPE text;
ALTER TABLE comments ALTER COLUMN project_id TYPE text;
ALTER TABLE activity_events ALTER COLUMN project_id TYPE text;
ALTER TABLE milestones ALTER COLUMN project_id TYPE text;

-- Recreate foreign key constraints
ALTER TABLE tasks
  ADD CONSTRAINT tasks_project_id_fkey 
  FOREIGN KEY (project_id) 
  REFERENCES projects(id);

ALTER TABLE comments
  ADD CONSTRAINT comments_project_id_fkey 
  FOREIGN KEY (project_id) 
  REFERENCES projects(id);

ALTER TABLE activity_events
  ADD CONSTRAINT activity_events_project_id_fkey 
  FOREIGN KEY (project_id) 
  REFERENCES projects(id);

ALTER TABLE milestones
  ADD CONSTRAINT milestones_project_id_fkey 
  FOREIGN KEY (project_id) 
  REFERENCES projects(id)
  ON DELETE CASCADE;

-- Re-enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_events ENABLE ROW LEVEL SECURITY;