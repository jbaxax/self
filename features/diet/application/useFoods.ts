import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFood, searchFoods } from "../infrastructure/dietService"
import { FoodInput } from "../domain/types"

export function useFoods(query: string) {
  return useQuery({
    queryFn: () => searchFoods(query),
    queryKey: [ "foods",query],
  })
}

export function useCreateFood() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: FoodInput) => createFood(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["foods"] }),
  })
}
