import { MealGroup } from "../../domain/types"
import AddEntryDialog from "./AddEntryDialog"

interface MealSectionProps {
  mealGroup: MealGroup,
  date:string
}

export default function MealSection({ mealGroup,date }: MealSectionProps) {
  const title = mealGroup.mealType.name
  const entries = mealGroup.entries
  return (
    <div>
      <h2>{title}</h2>
      {entries.length === 0 && <p>No results</p>}
      <ul>
        {entries.map((e) => (
          <li key={e.id}>{e.foods.name} - {e.quantity} - {e.calories} </li>
        ))}
      </ul>
      <AddEntryDialog mealTypeId={mealGroup.mealType.id} date={date} />
    </div>
  )
}
