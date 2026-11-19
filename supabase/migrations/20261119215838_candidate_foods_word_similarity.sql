CREATE OR REPLACE FUNCTION candidate_foods(p_text text, p_k int, p_threshold real)
RETURNS TABLE (id uuid, name text, calories integer, portion_desc text, score real)
LANGUAGE sql STABLE AS $$
  WITH searchable AS (
    SELECT id AS food_id, lower(name) AS text FROM foods
    UNION ALL
    SELECT food_id, lower(alias) FROM food_aliases
  )
  SELECT f.id, f.name, f.calories, f.portion_desc,
         max(word_similarity(s.text, lower(p_text))) AS best
  FROM foods f
  JOIN searchable s ON f.id = s.food_id
  WHERE word_similarity(s.text, lower(p_text)) >= p_threshold
  GROUP BY f.id
  ORDER BY best DESC
  LIMIT p_k;
$$;
