const CACHE_PREFIX = "emide:cache:";

interface CacheEnvelope<T> {
  expiresAt: number;
  value: T;
}

function getStorageKey(key: string): string {
  return `${CACHE_PREFIX}${key}`;
}

export function readCachedValue<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(getStorageKey(key));

    if (!rawValue) {
      return null;
    }

    const payload = JSON.parse(rawValue) as CacheEnvelope<T>;

    if (!payload || typeof payload.expiresAt !== "number" || payload.expiresAt <= Date.now()) {
      window.localStorage.removeItem(getStorageKey(key));
      return null;
    }

    return payload.value;
  } catch {
    return null;
  }
}

export function writeCachedValue<T>(key: string, value: T, ttlMs: number): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const payload: CacheEnvelope<T> = {
      expiresAt: Date.now() + ttlMs,
      value,
    };

    window.localStorage.setItem(getStorageKey(key), JSON.stringify(payload));
  } catch {
    // Ignore quota and serialization failures for non-critical public data.
  }
}
