INSERT INTO foods (name, portion_desc, calories, user_id)
VALUES ('Mostro a lo pobre', '1 plato', 1800, NULL),
       ('Mostro', '1 plato', 1550, NULL)
ON CONFLICT ON CONSTRAINT foods_user_name_unique DO NOTHING;
