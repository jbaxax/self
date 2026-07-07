import { describe, it, expect } from "vitest"
import { calculateCalorieResult } from "./calories"

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
