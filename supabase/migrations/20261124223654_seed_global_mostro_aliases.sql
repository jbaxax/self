INSERT INTO food_aliases (food_id, alias)
SELECT f.id, lower(trim(v.alias))
FROM (VALUES ('Mostro', 'monstruo'),
             ('Mostro a lo pobre', 'monstruo a lo pobre')) AS v(food_name, alias)
JOIN foods f ON f.name = v.food_name AND f.user_id IS NULL
ON CONFLICT DO NOTHING;
