"use client"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useFoods } from "../../application/useFoods"
import { useDebounce } from "@/hooks/useDebounce"
import { Spinner } from "@/components/ui/spinner"
import { Tables } from "@/lib/supabase/types"

interface FoodSearchProps {
  onSelect: (food: Tables<"foods">) => void
}

export default function FoodSearch({ onSelect }: FoodSearchProps) {
  const [search, setSearch] = useState("")

  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading, error } = useFoods(debouncedSearch)
  return (
    <div>
      <Input value={search} onChange={(v) => setSearch(v.target.value)} />

      {isLoading && <Spinner />}
      {error && <p>Error searching</p>}
      {data?.length === 0 && <p>No results found</p>}

      <ul>
        {data?.map((food) => (
          <li key={food.id}>
            <button onClick={() => onSelect(food)} type="button">
              {food.name} - {food.calories} cal
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
