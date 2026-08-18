import { calculateDailyTotals } from "../../domain/calories"
import { MealGroup } from "../../domain/types"
import AddEntryDialog from "./AddEntryDialog"

interface MealSectionProps {
  mealGroup: MealGroup
  date: string
}

export default function MealSection({ mealGroup, date }: MealSectionProps) {
  const entries = mealGroup.entries
  const total = Math.round(calculateDailyTotals(entries).calories)

  return (
    <section className="bg-card overflow-hidden rounded-lg border">
      <header className="flex items-center justify-between gap-2 px-4 py-3">
        <h2 className="text-sm font-medium capitalize">
          {mealGroup.mealType.name}
        </h2>
        <span className="text-muted-foreground text-xs tabular-nums">
          {total} kcal
        </span>
      </header>

      {entries.length > 0 && (
        <ul className="divide-y border-t">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-3 px-4 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm">{entry.foods.name}</p>
                <p className="text-muted-foreground text-xs tabular-nums">
                  × {entry.quantity}
                </p>
              </div>
              <span className="text-muted-foreground text-sm tabular-nums">
                {Math.round(entry.calories)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <footer className="border-t p-2">
        <AddEntryDialog mealTypeId={mealGroup.mealType.id} date={date} />
      </footer>
    </section>
  )
}
