/** Auth network calls must finish or fail within this window so the spinner always stops. */
export const AUTH_TIMEOUT_MS = 10_000;

export const AUTH_TIMEOUT_MESSAGE =
  'Could not reach Cognation. Check your connection and try again.';

/**
 * Race `promise` against a timeout. Clears the timer when `promise` settles.
 * Rejects with AUTH_TIMEOUT_MESSAGE (Error) on timeout.
 */
export function withAuthTimeout<T>(
  promise: Promise<T>,
  ms: number = AUTH_TIMEOUT_MS,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(AUTH_TIMEOUT_MESSAGE));
    }, ms);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer !== undefined) clearTimeout(timer);
  }) as Promise<T>;
}

/** Map raw network errors (e.g. "fetch failed") to a clear user-facing message. */
export function formatAuthError(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const msg = String(raw).trim();
  if (!msg) return null;
  const lower = msg.toLowerCase();
  if (
    lower === 'fetch failed' ||
    lower.includes('network request failed') ||
    lower.includes('failed to fetch') ||
    lower.includes('networkerror') ||
    lower.includes('could not reach cognation')
  ) {
    return AUTH_TIMEOUT_MESSAGE;
  }
  return msg;
}
