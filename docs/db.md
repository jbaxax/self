-- Objetivo del usuario
CREATE TYPE goal_type AS ENUM (
  'lose_weight',
  'maintain',
  'gain_muscle'
);

-- Nivel de actividad física
CREATE TYPE activity_level_type AS ENUM (
  'sedentary',
  'light',
  'moderate',
  'active'
);


CREATE TABLE public.users (
  id             uuid                PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email          text                NOT NULL UNIQUE,
  weight         decimal(5,2),
  height         decimal(5,2),
  age            integer,
  goal           goal_type           DEFAULT 'maintain',
  activity_level activity_level_type DEFAULT 'moderate',
  created_at     timestamptz         DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuario ve solo su perfil"
  ON public.users FOR ALL
  USING (auth.uid() = id);

-- Crea el perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


CREATE TABLE public.meal_types (
  id    serial PRIMARY KEY,
  name  text   NOT NULL UNIQUE
);

ALTER TABLE public.meal_types ENABLE ROW LEVEL SECURITY;

-- Todos los usuarios autenticados pueden leerla
CREATE POLICY "Lectura pública autenticada"
  ON public.meal_types FOR SELECT
  TO authenticated
  USING (true);

INSERT INTO public.meal_types (name) VALUES
  ('Desayuno'),
  ('Almuerzo'),
  ('Cena'),
  ('Snack');


CREATE TABLE public.foods (
  id           uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid         REFERENCES public.users(id) ON DELETE CASCADE,
  name         text         NOT NULL,
  portion_desc text         NOT NULL,
  calories     integer      NOT NULL,
  protein      decimal(5,1),
  carbs        decimal(5,1),
  fat          decimal(5,1),
  created_at   timestamptz  DEFAULT now()
);

ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;

-- Ver alimentos del sistema (user_id NULL) + los propios
CREATE POLICY "Ver alimentos disponibles"
  ON public.foods FOR SELECT
  TO authenticated
  USING (user_id IS NULL OR user_id = auth.uid());

-- Solo crear/editar/borrar los propios
CREATE POLICY "Gestionar alimentos propios"
  ON public.foods FOR ALL
  USING (user_id = auth.uid());

-- Alimentos del sistema (user_id = NULL)
INSERT INTO public.foods (name, portion_desc, calories, protein, carbs, fat) VALUES
  ('Huevo sancochado',        '1 unidad',        78,  6.3, 0.6,  5.3),
  ('Huevo frito',              '1 unidad',        90,  6.3, 0.4,  6.8),
  ('Pan de molde',             '1 rebanada',      80,  2.7,14.9,  0.9),
  ('Té verde sin azúcar',      '1 taza',           2,  0.0, 0.0,  0.0),
  ('Emoliente sin azúcar',     '1 vaso',          15,  0.0, 3.5,  0.0),
  ('Pechuga de pollo',         '1 porción (150g)',248, 46.5, 0.0,  5.4),
  ('Papa sancochada',          '1 unidad mediana',130,  3.0,29.0,  0.1),
  ('Ensalada de verduras',     '1 plato',          45,  2.5, 8.0,  0.5),
  ('Pollo a la braza',         '1 porción',       520, 48.0, 5.0, 32.0),
  ('Ceviche',                  '1 plato',         380, 28.0,30.0, 14.0),
  ('Chifa arroz chaufa',       '1 plato',         620, 22.0,85.0, 20.0),
  ('Pizza',                    '2 porciones',     550, 22.0,64.0, 22.0),
  ('Caldo de gallina',         '1 plato',         280, 24.0,18.0, 10.0),
  ('Pan con pollo',            '1 sándwich',      420, 28.0,45.0, 14.0),
  ('Plátano de isla',          '1 unidad',         90,  1.1,23.0,  0.3),
  ('Cancha popcorn',           '1 puñado',        120,  3.5,20.0,  3.0);



CREATE TABLE public.meal_entries (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  food_id      uuid        NOT NULL REFERENCES public.foods(id),
  meal_type_id integer     NOT NULL REFERENCES public.meal_types(id),
  quantity     integer     NOT NULL DEFAULT 1,
  log_date     date        NOT NULL,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE public.meal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solo entradas propias"
  ON public.meal_entries FOR ALL
  USING (user_id = auth.uid());

  