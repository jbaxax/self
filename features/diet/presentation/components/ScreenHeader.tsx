"use client"

import { ChevronLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogTitle } from "@/components/ui/dialog"

interface ScreenHeaderProps {
  title: string
  badge?: string
  onBack?: () => void
}

export default function ScreenHeader({
  title,
  badge,
  onBack,
}: ScreenHeaderProps) {
  return (
    <div className="flex h-14 shrink-0 items-center gap-1 border-b pr-4 pl-1">
      {onBack ? (
        <Button
          type="button"
          variant="ghost"
          className="size-12"
          aria-label="Back to the list"
          onClick={onBack}
        >
          <ChevronLeft className="size-6" />
        </Button>
      ) : (
        <DialogClose asChild>
          <Button
            type="button"
            variant="ghost"
            className="size-12"
            aria-label="Close"
          >
            <X className="size-6" />
          </Button>
        </DialogClose>
      )}
      <DialogTitle className="flex-1 text-lg font-semibold">{title}</DialogTitle>
      {badge && (
        <span className="text-muted-foreground bg-muted rounded px-2 py-0.5 text-xs">
          {badge}
        </span>
      )}
    </div>
  )
}
