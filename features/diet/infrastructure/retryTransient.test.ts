import { describe, it, expect, vi } from "vitest"
import { isTransientError, retryTransient } from "./retryTransient"

class FakeApiError extends Error {
  constructor(public status: number) {
    super(`status ${status}`)
  }
}

const noSleep = () => Promise.resolve()

describe("isTransientError", () => {
  it("treats 503 and 429 as transient", () => {
    expect(isTransientError(new FakeApiError(503))).toBe(true)
    expect(isTransientError(new FakeApiError(429))).toBe(true)
  })

  it("does not treat 400, 404 or non API errors as transient", () => {
    expect(isTransientError(new FakeApiError(400))).toBe(false)
    expect(isTransientError(new FakeApiError(404))).toBe(false)
    expect(isTransientError(new Error("boom"))).toBe(false)
    expect(isTransientError(null)).toBe(false)
  })
})

describe("retryTransient", () => {
  it("retries a 503 and returns the later success", async () => {
    const operation = vi
      .fn()
      .mockRejectedValueOnce(new FakeApiError(503))
      .mockRejectedValueOnce(new FakeApiError(503))
      .mockResolvedValueOnce("parsed")

    const result = await retryTransient(operation, { sleep: noSleep })

    expect(result).toBe("parsed")
    expect(operation).toHaveBeenCalledTimes(3)
  })

  it("gives up after the configured attempts and rethrows the last error", async () => {
    const error = new FakeApiError(503)
    const operation = vi.fn().mockRejectedValue(error)

    await expect(
      retryTransient(operation, { attempts: 3, sleep: noSleep })
    ).rejects.toBe(error)
    expect(operation).toHaveBeenCalledTimes(3)
  })

  it("does not retry a non transient error", async () => {
    const operation = vi.fn().mockRejectedValue(new FakeApiError(404))

    await expect(retryTransient(operation, { sleep: noSleep })).rejects.toThrow(
      "status 404"
    )
    expect(operation).toHaveBeenCalledTimes(1)
  })

  it("waits longer between each attempt", async () => {
    const sleep = vi.fn().mockResolvedValue(undefined)
    const operation = vi
      .fn()
      .mockRejectedValueOnce(new FakeApiError(503))
      .mockRejectedValueOnce(new FakeApiError(503))
      .mockResolvedValueOnce("ok")

    await retryTransient(operation, { baseDelayMs: 100, sleep })

    expect(sleep.mock.calls).toEqual([[100], [200]])
  })
})
