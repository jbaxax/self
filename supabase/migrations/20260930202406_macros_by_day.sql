CREATE VIEW macros_by_day WITH (security_invoker = true) as SELECT
 user_id, log_date, 
 SUM(calories) AS calories, 
 SUM(carbs) AS carbs, 
 SUM(protein) as protein,
 SUM(fat) AS fat 
 FROM meal_entries 
 GROUP BY log_date, user_id;