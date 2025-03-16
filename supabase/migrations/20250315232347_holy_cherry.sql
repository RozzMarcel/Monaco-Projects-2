/*
  # Add Test Data for Risk Management

  1. Changes
    - Add sample risks to risk_register
    - Add sample history records
    - Test different risk scenarios

  2. Data
    - Active risks with different impact/probability levels
    - Resolved and deleted risk examples
    - Corresponding history records
*/

-- Add test risks to risk_register
INSERT INTO risk_register (id, project_id, description, manager, impact, probability, mitigation, date, status)
VALUES
  ('R001', 'slot-1', 'Potential delay in permit approval', 'John Smith', 4, 3, 'Early submission and regular follow-up with authorities', '2024-03-15', 'active'),
  ('R002', 'slot-1', 'Supply chain disruption for critical materials', 'Sarah Johnson', 5, 2, 'Identify alternative suppliers and maintain buffer stock', '2024-03-15', 'active'),
  ('R003', 'slot-1', 'Unexpected ground conditions', 'Mike Brown', 3, 4, 'Additional geotechnical surveys scheduled', '2024-03-15', 'active'),
  ('R004', 'slot-1', 'Budget overrun in foundation work', 'Emma Davis', 4, 4, 'Weekly cost monitoring and value engineering options', '2024-03-15', 'active'),
  ('R005', 'slot-1', 'Safety concerns with scaffolding', 'Tom Wilson', 5, 3, 'Daily inspections and immediate repairs when needed', '2024-03-15', 'active');

-- Add test records to risk_history
INSERT INTO risk_history (risk_id, project_id, action, date, metadata)
VALUES
  ('R001', 'slot-1', 'created', '2024-03-15 10:00:00', jsonb_build_object(
    'description', 'Potential delay in permit approval',
    'manager', 'John Smith',
    'impact', 4,
    'probability', 3,
    'mitigation', 'Early submission and regular follow-up with authorities',
    'date', '2024-03-15'
  )),
  ('R002', 'slot-1', 'created', '2024-03-15 10:15:00', jsonb_build_object(
    'description', 'Supply chain disruption for critical materials',
    'manager', 'Sarah Johnson',
    'impact', 5,
    'probability', 2,
    'mitigation', 'Identify alternative suppliers and maintain buffer stock',
    'date', '2024-03-15'
  )),
  ('R003', 'slot-1', 'created', '2024-03-15 10:30:00', jsonb_build_object(
    'description', 'Unexpected ground conditions',
    'manager', 'Mike Brown',
    'impact', 3,
    'probability', 4,
    'mitigation', 'Additional geotechnical surveys scheduled',
    'date', '2024-03-15'
  )),
  ('R004', 'slot-1', 'created', '2024-03-15 10:45:00', jsonb_build_object(
    'description', 'Budget overrun in foundation work',
    'manager', 'Emma Davis',
    'impact', 4,
    'probability', 4,
    'mitigation', 'Weekly cost monitoring and value engineering options',
    'date', '2024-03-15'
  )),
  ('R005', 'slot-1', 'created', '2024-03-15 11:00:00', jsonb_build_object(
    'description', 'Safety concerns with scaffolding',
    'manager', 'Tom Wilson',
    'impact', 5,
    'probability', 3,
    'mitigation', 'Daily inspections and immediate repairs when needed',
    'date', '2024-03-15'
  ));