const stores = new Map<string, Map<string, number[]>>();

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  let store = stores.get(key);
  if (!store) {
    store = new Map();
    stores.set(key, store);
  }

  const timestamps = store.get(key) || [];
  const cutoff = now - windowMs;
  const recent = timestamps.filter((t) => t > cutoff);

  if (recent.length >= limit) {
    return { allowed: false, remaining: 0 };
  }

  recent.push(now);
  store.set(key, recent);
  return { allowed: true, remaining: limit - recent.length };
}

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [, store] of stores) {
    for (const [key, timestamps] of store) {
      const cutoff = now - 5 * 60 * 1000;
      store.set(key, timestamps.filter((t) => t > cutoff));
    }
  }
}, 5 * 60 * 1000);
