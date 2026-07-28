import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MealEntryInput } from "../domain/types"
import { createMealEntry } from "../infrastructure/dietService"

export function useCreateMealEntry() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (body: MealEntryInput) => createMealEntry(body),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["entry"] })
    })
}