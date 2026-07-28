import { describe, it, expect } from "vitest"
import { addDays } from "./date"

describe("addDaysResult",() => {
    it("end of the month", () => {
        const result = addDays("2026-06-30",1)

        expect(result).toBe("2026-07-01")
    })

    it("end of the year", () => {
        const result = addDays("2026-12-31",1)
        expect(result).toBe("2027-01-01")
    }) 

    it("rest one day", () => {
        const result = addDays("2026-12-31",-1)
        expect(result).toBe("2026-12-30")
    }) 


    
})