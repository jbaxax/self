import { useMutation } from "@tanstack/react-query"
import { parseMealText } from "../infrastructure/mealParserService"

export function useParseMealText() {
  return useMutation({
    mutationFn: (text: string) => parseMealText(text),
  })
}
