ALTER TABLE foods
ADD CONSTRAINT foods_user_name_unique UNIQUE NULLS NOT DISTINCT (user_id, name);

CREATE OR REPLACE FUNCTION log_meals(p_log_date date, p_meals jsonb)
RETURNS void
LANGUAGE plpgsql AS $$
DECLARE
  meal jsonb;
  food jsonb;
  v_meal_type_id int;
  v_food_id uuid;
  v_quantity numeric;
  v_calories numeric;
  v_protein numeric;
  v_carbs numeric;
  v_fat numeric;
BEGIN
  FOR meal IN SELECT * FROM jsonb_array_elements(p_meals->'meals') LOOP
    SELECT id INTO v_meal_type_id FROM meal_types WHERE name = meal->>'meal_type';
    IF v_meal_type_id IS NULL THEN
      RAISE EXCEPTION 'Unknown meal type: %', meal->>'meal_type';
    END IF;

    FOR food IN SELECT * FROM jsonb_array_elements(meal->'items') LOOP
      v_quantity := (food->>'quantity')::numeric;
      IF v_quantity <= 0 THEN
        RAISE EXCEPTION 'Quantity must be positive';
      END IF;

      IF food->>'existing_id' IS NULL THEN
        SELECT id INTO v_food_id FROM foods
        WHERE user_id = auth.uid() AND name = food->>'name';

        IF v_food_id IS NULL THEN
          IF (food->>'calories')::numeric <= 0 OR (food->>'calories')::numeric > 2000 THEN
            RAISE EXCEPTION 'Calories out of range';
          END IF;
          INSERT INTO foods (name, portion_desc, calories, user_id)
          VALUES (food->>'name', food->>'portion_desc', (food->>'calories')::numeric, auth.uid())
          RETURNING id INTO v_food_id;
        END IF;
      ELSE
        v_food_id := (food->>'existing_id')::uuid;
      END IF;

      SELECT calories, protein, carbs, fat INTO v_calories, v_protein, v_carbs, v_fat
      FROM foods WHERE id = v_food_id;
      IF NOT FOUND THEN
        RAISE EXCEPTION 'Unknown food';
      END IF;

      INSERT INTO meal_entries (user_id, food_id, calories, protein, carbs, fat, meal_type_id, log_date, quantity)
      VALUES (auth.uid(), v_food_id, v_calories * v_quantity, v_protein * v_quantity, v_carbs * v_quantity, v_fat * v_quantity, v_meal_type_id, p_log_date, v_quantity);
    END LOOP;
  END LOOP;
END;
$$;
