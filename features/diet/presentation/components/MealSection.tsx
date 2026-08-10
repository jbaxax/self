import { MealGroup } from "../../domain/types"

interface MealSectionProps {
  mealGroup: MealGroup
}

export default function MealSection({ mealGroup }: MealSectionProps) {
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
    </div>
  )
}
