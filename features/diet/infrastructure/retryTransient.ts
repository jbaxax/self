const TRANSIENT_STATUSES = [429, 503]

interface RetryOptions {
  attempts?: number
  baseDelayMs?: number
  sleep?: (ms: number) => Promise<void>
}

export function isTransientError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false
  const { status } = error as { status?: unknown }
  return typeof status === "number" && TRANSIENT_STATUSES.includes(status)
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function retryTransient<T>(
  operation: () => Promise<T>,
  { attempts = 3, baseDelayMs = 1000, sleep = wait }: RetryOptions = {}
): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await operation()
    } catch (error) {
      if (!isTransientError(error) || attempt >= attempts) throw error
      await sleep(baseDelayMs * 2 ** (attempt - 1))
    }
  }
}
