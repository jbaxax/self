ALTER TABLE public.meal_entries
  ADD COLUMN calories integer NOT NULL DEFAULT 0,
  ADD COLUMN protein decimal(5,1),
  ADD COLUMN carbs decimal(5,1),
  ADD COLUMN fat decimal(5,1);