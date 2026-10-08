import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { MealEntryInput } from "../domain/types"
import { createMealEntry, deleteMealEntry, getDailyLog, getMealTypes } from "../infrastructure/dietService"

export function useCreateMealEntry() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (body: MealEntryInput) => createMealEntry(body),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["mealEntries"] })
    })
}

export function useDeleteMealEntry() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => deleteMealEntry(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["mealEntries"] })
    })
}

export function useDailyLog(logDate: string) {
  return useQuery({
    queryFn: () => getDailyLog(logDate),
    queryKey: ["mealEntries", logDate],
  })
}

export function useMealTypes(){
  return useQuery({
    queryFn: getMealTypes,
    queryKey: ["mealTypes"]
  })
}