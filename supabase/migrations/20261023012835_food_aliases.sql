CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA extensions;

CREATE TABLE IF NOT EXISTS food_aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  food_id uuid NOT NULL REFERENCES foods(id) ON DELETE CASCADE,
  alias text NOT NULL,
  UNIQUE (food_id, alias),
  CHECK (length(trim(alias)) > 0)
);

DROP POLICY IF EXISTS "See aliases of visible foods" ON food_aliases;

ALTER TABLE food_aliases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "See aliases of visible foods" ON food_aliases
FOR SELECT
USING (EXISTS (SELECT 1 FROM foods WHERE foods.id = food_aliases.food_id));

DROP POLICY IF EXISTS "Manage aliases of own foods" ON food_aliases;
CREATE POLICY "Manage aliases of own foods" ON food_aliases
FOR ALL
USING (EXISTS (SELECT 1 FROM foods
               WHERE foods.id = food_aliases.food_id AND foods.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM foods
                    WHERE foods.id = food_aliases.food_id AND foods.user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS food_aliases_alias_trgm_idx
ON food_aliases USING gin (lower(alias) extensions.gin_trgm_ops);
