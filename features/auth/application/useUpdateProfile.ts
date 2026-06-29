import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateUser } from "../infrastructure/authService.server"
import { UpdateUserInput } from "../presentation/schemas/profileSchema"

export function useUpdateProfile(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: UpdateUserInput) => updateUser(id, body),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["profile", id] }),
  })
}
