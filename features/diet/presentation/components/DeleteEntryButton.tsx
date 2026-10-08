"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useDeleteMealEntry } from "../../application/useMealEntries"

interface DeleteEntryButtonProps {
  entryId: string
}

export default function DeleteEntryButton({ entryId }: DeleteEntryButtonProps) {
  const deleteMealEntry = useDeleteMealEntry()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Delete entry"
      disabled={deleteMealEntry.isPending}
      onClick={() => deleteMealEntry.mutate(entryId)}
    >
      {deleteMealEntry.isPending ? <Spinner /> : <Trash2 />}
    </Button>
  )
}
