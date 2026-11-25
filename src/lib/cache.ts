const store = new Map<string, { expires: number; promise: Promise<unknown> }>();

/** Caches the promise itself, so simultaneous callers share one request. */
export function cached<T>(
  key: string,
  ttlMs: number,
  loader: () => Promise<T>
): Promise<T> {
  const hit = store.get(key);
  if (hit && hit.expires > Date.now()) return hit.promise as Promise<T>;

  const promise = loader();
  store.set(key, { expires: Date.now() + ttlMs, promise });

  // Never keep failures.
  promise.catch(() => {
    if (store.get(key)?.promise === promise) store.delete(key);
  });

  // Keep memory bounded.
  if (store.size > 500) {
    const oldest = store.keys().next().value;
    if (oldest) store.delete(oldest);
  }
  return promise;
}