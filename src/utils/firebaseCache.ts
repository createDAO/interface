const isBrowser = typeof window !== 'undefined';

// Define cache structure
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Cache storage
interface CacheStorage {
  [key: string]: CacheItem<unknown>;
}

// In-memory cache
const memoryCache: CacheStorage = {};

// Default cache duration (5 minutes)
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000;

/**
 * Set an item in the cache
 * @param key Cache key
 * @param data Data to cache
 * @param duration Cache duration in milliseconds (default: 5 minutes)
 */
export function setCacheItem<T>(key: string, data: T, duration: number = DEFAULT_CACHE_DURATION): void {
  const now = Date.now();
  memoryCache[key] = {
    data,
    timestamp: now,
    expiresAt: now + duration,
  };
  
  // Also store in localStorage for persistence across page refreshes
  // Only if we're in a browser environment
  if (isBrowser) {
    try {
      localStorage.setItem(
        `firebase_cache_${key}`,
        JSON.stringify({
          data,
          timestamp: now,
          expiresAt: now + duration,
        })
      );
    } catch (error) {
      console.warn('Failed to store cache in localStorage:', error);
    }
  }
}

/**
 * Get an item from the cache
 * @param key Cache key
 * @returns Cached data or null if not found or expired
 */
export function getCacheItem<T>(key: string): T | null {
  // First check memory cache
  const cacheItem = memoryCache[key];
  const now = Date.now();
  
  if (cacheItem && cacheItem.expiresAt > now) {
    return cacheItem.data as T;
  }
  
  // If not in memory, check localStorage (only in browser)
  if (isBrowser) {
    try {
      const storedItem = localStorage.getItem(`firebase_cache_${key}`);
      if (storedItem) {
        const parsedItem = JSON.parse(storedItem) as CacheItem<T>;
        if (parsedItem.expiresAt > now) {
          // Restore to memory cache and return
          memoryCache[key] = parsedItem;
          return parsedItem.data;
        } else {
          // Remove expired item from localStorage
          localStorage.removeItem(`firebase_cache_${key}`);
        }
      }
    } catch (error) {
      console.warn('Failed to retrieve cache from localStorage:', error);
    }
  }
  
  return null;
}

/**
 * Clear a specific cache item
 * @param key Cache key
 */
export function clearCacheItem(key: string): void {
  delete memoryCache[key];
  if (isBrowser) {
    try {
      localStorage.removeItem(`firebase_cache_${key}`);
    } catch (error) {
      console.warn('Failed to remove cache from localStorage:', error);
    }
  }
}

/**
 * Clear all cache items
 */
export function clearCache(): void {
  // Clear memory cache
  Object.keys(memoryCache).forEach(key => {
    delete memoryCache[key];
  });
  
  // Clear localStorage cache (only in browser)
  if (isBrowser) {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('firebase_cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear cache from localStorage:', error);
    }
  }
}

/**
 * Generate a cache key for DAO queries
 * @param networkId Network ID filter (null for all networks)
 * @param page Page number
 * @param pageSize Page size
 * @returns Cache key
 */
export function generateDAOCacheKey(networkId: number | null, page: number, pageSize: number): string {
  return `daos_${networkId || 'all'}_${page}_${pageSize}`;
}
