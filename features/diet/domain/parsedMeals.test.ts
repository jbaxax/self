import { describe, it, expect } from "vitest"
import { cleanAliases, MAX_ALIAS_LENGTH, MAX_ALIASES_PER_FOOD } from "./parsedMeals"

describe("cleanAliases", () => {
  it("returns an empty list when the model sends no aliases", () => {
    expect(cleanAliases(undefined)).toEqual([])
  })

  it("trims whitespace and drops empty aliases", () => {
    expect(cleanAliases([" huevo ", "", "   "])).toEqual(["huevo"])
  })

  it("drops aliases longer than the maximum length", () => {
    const tooLong = "a".repeat(MAX_ALIAS_LENGTH + 1)
    const exact = "b".repeat(MAX_ALIAS_LENGTH)
    expect(cleanAliases([tooLong, exact])).toEqual([exact])
  })

  it("keeps one alias when only the case or the spaces differ", () => {
    expect(cleanAliases(["Pollo", "pollo ", " POLLO"])).toEqual(["Pollo"])
  })

  it("keeps only the first aliases up to the maximum count", () => {
    const many = Array.from({ length: MAX_ALIASES_PER_FOOD + 2 }, (_, i) => `alias ${i}`)
    expect(cleanAliases(many)).toEqual(many.slice(0, MAX_ALIASES_PER_FOOD))
  })
})
