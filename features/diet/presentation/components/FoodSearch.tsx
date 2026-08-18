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
    <div className="flex flex-col gap-3">
      <Input
        value={search}
        placeholder="Search food"
        onChange={(v) => setSearch(v.target.value)}
      />

      {isLoading && (
        <div className="flex h-24 items-center justify-center">
          <Spinner />
        </div>
      )}

      {error && <p className="text-destructive text-sm">Error searching.</p>}

      {data?.length === 0 && (
        <p className="text-muted-foreground py-6 text-center text-sm">
          No results found.
        </p>
      )}

      {(data?.length ?? 0) > 0 && (
        <ul className="max-h-64 divide-y overflow-y-auto rounded-md border">
          {data?.map((food) => (
            <li key={food.id}>
              <button
                type="button"
                onClick={() => onSelect(food)}
                className="hover:bg-accent flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors"
              >
                <span className="truncate text-sm">{food.name}</span>
                <span className="text-muted-foreground text-xs tabular-nums">
                  {food.calories} kcal
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
