INSERT INTO food_aliases (food_id, alias)
SELECT f.id, lower(trim(v.alias))
FROM (VALUES ('Cheese', 'queso'),
             ('Egg', 'huevo'),
             ('Egg', 'huevos'),
             ('Egg white', 'clara de huevo'),
             ('Bread', 'pan'),
             ('Whole-wheat bread', 'pan integral'),
             ('Rice', 'arroz'),
             ('Avocado', 'palta'),
             ('Large fries', 'papas fritas'),
             ('Fried cassava', 'yuca frita'),
             ('Fried sweet potato', 'camote frito'),
             ('Tuna', 'atún'),
             ('Ice cream', 'helado'),
             ('Lentil soup', 'sopa de lentejas')) AS v(food_name, alias)
JOIN foods f ON trim(f.name) = v.food_name
ON CONFLICT DO NOTHING;
