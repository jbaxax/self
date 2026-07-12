import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useFoods } from "../../application/useFoods"
import { useDebounce } from "@/hooks/useDebounce"
import { Spinner } from "@/components/ui/spinner"

export default function FoodSearch() {
  const [search, setSearch] = useState("")

  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading, error } = useFoods(debouncedSearch)
  return (
    <div>
      <Input value={search} onChange={(v) => setSearch(v.target.value)} />

      {isLoading && <Spinner />}
      {error && <p>Error al buscar</p>}
      {data?.length === 0 && <p>No hay resultados</p>}

      <ul>
        {data?.map((food) => (
          <li key={food.id}>
            {food.name} - {food.calories} cal
          </li>
        ))}
      </ul>
    </div>
  )
}
