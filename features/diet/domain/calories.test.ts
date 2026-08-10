import { describe, it, expect } from "vitest"
import { calculateCalorieResult, scaleMacros } from "./calories"

describe("calculateCalorieResult", () => {
  it("male, sedentary, lose_weight", () => {
    const result = calculateCalorieResult({
      weight: 70,
      height: 175,
      age: 25,
      sex: "male",
      activityLevel: "sedentary",
      goal: "lose_weight",
    })

    expect(result.bmr).toBeCloseTo(1673.75, 2)
    expect(result.tdee).toBeCloseTo(2008.5, 2)
    expect(result.target).toBeCloseTo(1606.8, 2)
  })

  it("male, sedentary, maintain", () => {
    const result = calculateCalorieResult({
      weight: 70,
      height: 175,
      age: 25,
      sex: "male",
      activityLevel: "sedentary",
      goal: "maintain",
    })

    expect(result.target).toBeCloseTo(2008.5, 2)
  })

  it("male, sedentary, gain_muscle", () => {
    const result = calculateCalorieResult({
      weight: 70,
      height: 175,
      age: 25,
      sex: "male",
      activityLevel: "sedentary",
      goal: "gain_muscle",
    })

    expect(result.target).toBeCloseTo(2209.35, 2)
  })

  it("female, sedentary, lose_weight", () => {
    const result = calculateCalorieResult({
      weight: 70,
      height: 175,
      age: 25,
      sex: "female",
      activityLevel: "sedentary",
      goal: "lose_weight",
    })

    expect(result.bmr).toBeCloseTo(1507.75, 2)
    expect(result.tdee).toBeCloseTo(1809.3, 2)
    expect(result.target).toBeCloseTo(1447.44, 2)
  })

  it("female, moderate, lose_weight", () => {
    const result = calculateCalorieResult({
      weight: 70,
      height: 175,
      age: 25,
      sex: "female",
      activityLevel: "moderate",
      goal: "lose_weight",
    })

    expect(result.bmr).toBeCloseTo(1507.75, 2)
    expect(result.tdee).toBeCloseTo(2337.01, 2)
    expect(result.target).toBeCloseTo(1869.61, 2)
  })
})

describe("scaleMacros", () => {
  it("scales calories and protein by quantity", () => {
    const result = scaleMacros({ 
      id: "ea", 
      name: "pollo", 
      portion_desc: "unidad", 
      calories: 165, 
      protein: 31, 
      carbs: null, 
      created_at: null, 
      fat: null, 
      user_id: null }
      , 2)

      expect(result.calories).toBe(330)
      expect(result.protein).toBe(62)
  })

   it("treats null protein as zero", () => {
    const result = scaleMacros({ 
      id: "ea", 
      name: "pollo", 
      portion_desc: "unidad", 
      calories: 165, 
      protein: null, 
      carbs: null, 
      created_at: null, 
      fat: null, 
      user_id: null }
      , 2)

      expect(result.calories).toBe(330)
      expect(result.protein).toBe(0)
  })
})