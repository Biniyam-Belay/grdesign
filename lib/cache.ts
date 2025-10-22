/**
 * Cache utilities for optimizing data fetching
 */

// In-memory cache for development/SSR
const memoryCache = new Map<string, { data: unknown; timestamp: number }>();

export const CACHE_TIMES = {
  BLOGS: 60 * 5, // 5 minutes
  PROJECTS: 60 * 5, // 5 minutes
  STATIC: 60 * 60 * 24, // 24 hours
} as const;

interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
}

/**
 * Get cached data or fetch and cache it
 */
export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {},
): Promise<T> {
  const { ttl = 300 } = options; // Default 5 minutes

  // Check memory cache first
  const cached = memoryCache.get(key);
  if (cached) {
    const age = (Date.now() - cached.timestamp) / 1000;
    if (age < ttl) {
      return cached.data as T;
    }
  }

  // Fetch fresh data
  const data = await fetcher();

  // Store in memory cache
  memoryCache.set(key, {
    data,
    timestamp: Date.now(),
  });

  return data;
}

/**
 * Invalidate cache by key or pattern
 */
export function invalidateCache(keyOrPattern: string | RegExp): void {
  if (typeof keyOrPattern === "string") {
    memoryCache.delete(keyOrPattern);
  } else {
    // Pattern matching for regex
    const keys = Array.from(memoryCache.keys());
    keys.forEach((key) => {
      if (keyOrPattern.test(key)) {
        memoryCache.delete(key);
      }
    });
  }
}

/**
 * Clear all cache
 */
export function clearCache(): void {
  memoryCache.clear();
}

/**
 * Get cache stats
 */
export function getCacheStats() {
  return {
    size: memoryCache.size,
    keys: Array.from(memoryCache.keys()),
  };
}
