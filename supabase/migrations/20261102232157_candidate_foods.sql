CREATE OR REPLACE FUNCTION candidate_foods(p_text text, p_k int, p_threshold real)
RETURNS TABLE (id uuid, name text, calories integer, portion_desc text, score real)
LANGUAGE sql STABLE AS $$
  SELECT f.id, f.name, f.calories, f.portion_desc,
         max(similarity(lower(a.alias), lower(p_text))) AS best
  FROM foods f
  JOIN food_aliases a ON f.id = a.food_id
  WHERE lower(a.alias) % lower(p_text)
    AND similarity(lower(a.alias), lower(p_text)) >= p_threshold
  GROUP BY f.id
  ORDER BY best DESC
  LIMIT p_k;
$$;
