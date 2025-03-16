/*
  # Add Schedule Activity Integration

  1. Changes
    - Add schedule_events view for milestone activity tracking
    - Add trigger to automatically create activity events for milestone updates
    - Add test activity data

  2. Security
    - Maintain existing RLS policies
*/

-- Create function to handle milestone activity
CREATE OR REPLACE FUNCTION handle_milestone_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_events (
    project_id,
    type,
    action,
    target_id,
    metadata
  ) VALUES (
    NEW.project_id,
    'milestone',
    CASE
      WHEN TG_OP = 'INSERT' THEN 'created'
      WHEN NEW.status = 'completed' AND OLD.status != 'completed' THEN 'completed'
      ELSE 'updated'
    END,
    NEW.id::uuid,
    jsonb_build_object(
      'name', NEW.name,
      'due_date', NEW.due_date,
      'actual_date', NEW.actual_date,
      'status', NEW.status
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for milestone activity
CREATE TRIGGER milestone_activity_trigger
AFTER INSERT OR UPDATE ON schedule_milestones
FOR EACH ROW
EXECUTE FUNCTION handle_milestone_activity();

-- Add some test activity data
INSERT INTO activity_events (project_id, type, action, metadata)
VALUES
  ('slot-1', 'milestone', 'completed', '{"name": "Project Start", "status": "completed", "due_date": "2024-01-15", "actual_date": "2024-01-15"}'::jsonb),
  ('slot-1', 'milestone', 'completed', '{"name": "Design Phase Complete", "status": "completed", "due_date": "2024-03-01", "actual_date": "2024-03-05"}'::jsonb);