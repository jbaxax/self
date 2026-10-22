"use client"

import { Sparkles } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { useLogMeals } from "../../application/useMealEntries"
import { useParseMealText } from "../../application/useParseMealText"
import { MAX_MEAL_TEXT_LENGTH, ParsedMeals } from "../../domain/parsedMeals"
import ReviewStep from "./ReviewStep"
import ScreenHeader from "./ScreenHeader"

interface LogMealsDialogProps {
  date: string
  initialParsed?: ParsedMeals
  defaultOpen?: boolean
}

export default function LogMealsDialog({
  date,
  initialParsed,
  defaultOpen = false,
}: LogMealsDialogProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [text, setText] = useState("")
  const [parsed, setParsed] = useState<ParsedMeals | null>(initialParsed ?? null)
  const parseMealText = useParseMealText()
  const logMeals = useLogMeals()

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (next) return
    setText("")
    setParsed(null)
    parseMealText.reset()
    logMeals.reset()
  }

  function handleAnalyze() {
    parseMealText.mutate(text, { onSuccess: setParsed })
  }

  function handleSave() {
    if (parsed === null) return
    logMeals.mutate(
      { date, meals: parsed },
      { onSuccess: () => handleOpenChange(false) }
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-12 w-full text-base">
          <Sparkles />
          Log with AI
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col gap-0 overflow-hidden p-0 max-sm:top-0 max-sm:left-0 max-sm:h-dvh max-sm:w-full max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none sm:max-h-[85vh] sm:max-w-md"
      >
        <DialogDescription className="sr-only">
          Describe what you ate and review it before it is saved.
        </DialogDescription>

        {parsed === null ? (
          <>
            <ScreenHeader title="Log with AI" />
            <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
              <p className="text-muted-foreground text-sm">
                Describe what you ate in each meal. You review everything before
                it is saved.
              </p>
              <textarea
                value={text}
                maxLength={MAX_MEAL_TEXT_LENGTH}
                onChange={(e) => setText(e.target.value)}
                placeholder="Breakfast: two eggs and bread. Lunch: rice with chicken."
                className="border-input bg-background min-h-40 w-full rounded-xl border px-4 py-3 text-base outline-none"
              />
              {parseMealText.isError && (
                <p className="text-destructive text-sm">
                  Could not analyze that. Try again or rephrase it.
                </p>
              )}
            </div>
            <div className="shrink-0 border-t px-4 pt-3 pb-6">
              <Button
                type="button"
                className="h-[52px] w-full rounded-xl text-base font-semibold"
                disabled={text.trim().length === 0 || parseMealText.isPending}
                onClick={handleAnalyze}
              >
                {parseMealText.isPending && <Spinner />}
                Analyze
              </Button>
            </div>
          </>
        ) : (
          <ReviewStep
            parsed={parsed}
            isSaving={logMeals.isPending}
            hasError={logMeals.isError}
            onChange={setParsed}
            onBack={() => setParsed(null)}
            onSave={handleSave}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
