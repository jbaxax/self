export function addDays(dateStr: string, delta: number): string {
    const parts = dateStr.split("-")
    const year = Number(parts[0])
    const month = Number(parts[1]) - 1
    const day = Number(parts[2]) + delta

    const date = new Date(Date.UTC(year, month, day))
    const resultYear = String(date.getUTCFullYear())
    const resultMonth = String(date.getUTCMonth() + 1).padStart(2, "0")
    const resultDay = String(date.getUTCDate()).padStart(2, "0")

    const normalizedDate = `${resultYear}-${resultMonth}-${resultDay}`

    return normalizedDate
}
