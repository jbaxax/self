import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { MealEntryInput } from "../domain/types"
import { createMealEntry, getDailyLog } from "../infrastructure/dietService"

export function useCreateMealEntry() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (body: MealEntryInput) => createMealEntry(body),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["entries"] })
    })
}

export function useDailyLog(logDate: string) {
  return useQuery({
    queryFn: () => getDailyLog(logDate),
    queryKey: ["mealEntries", logDate],
  })
}