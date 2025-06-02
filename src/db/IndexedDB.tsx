// IndexedDB.tsx
import { openDB, type IDBPDatabase } from "idb";
import type { PersistedClient } from "@tanstack/react-query-persist-client";

// Database configuration
const DB_NAME = "AppCache";
const STORE_NAME = "queryCache";
const CACHE_VERSION = "1.0.0"; // Version for cache invalidation
const QUERY_CACHE_KEY = "REACT_QUERY_CACHE";

// Type for cache entry
interface CacheEntry {
  key: string;
  version: string;
  client: PersistedClient;
  timestamp: number;
}

// Initialize IndexedDB
async function initDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    },
  });
}

// Type-safe persister for React Query
export const idbPersister = {
  persistClient: async (client: PersistedClient) => {
    try {
      const db = await initDB();
      const cacheEntry: CacheEntry = {
        key: QUERY_CACHE_KEY,
        version: CACHE_VERSION,
        client,
        timestamp: Date.now(),
      };
      await db.put(STORE_NAME, cacheEntry);
    } catch (error) {
      console.error("Failed to persist query client:", error);
      // Optionally: Integrate with toast notifications for UI feedback
    }
  },
  restoreClient: async (): Promise<PersistedClient | undefined> => {
    try {
      const db = await initDB();
      const cacheEntry: CacheEntry | undefined = await db.get(
        STORE_NAME,
        QUERY_CACHE_KEY
      );

      if (!cacheEntry) {
        return undefined;
      }

      // Validate cache version and age
      if (cacheEntry.version !== CACHE_VERSION) {
        await db.delete(STORE_NAME, QUERY_CACHE_KEY);
        return undefined;
      }

      // Check cache age (expire after 24 hours)
      const maxAge = 1000 * 60 * 60 * 24; // 24 hours
      if (Date.now() - cacheEntry.timestamp > maxAge) {
        await db.delete(STORE_NAME, QUERY_CACHE_KEY);
        return undefined;
      }

      return cacheEntry.client;
    } catch (error) {
      console.error("Failed to restore query client:", error);
      return undefined;
    }
  },
  removeClient: async () => {
    try {
      const db = await initDB();
      await db.delete(STORE_NAME, QUERY_CACHE_KEY);
    } catch (error) {
      console.error("Failed to remove query client:", error);
    }
  },
};

// Query keys to persist
export const persistQueryKeys = [
  "tetelek",
  "tetelDetail",
  "tetel-count",
  "question-count",
  "flashcard-count",
  "tetel-list-home",
  "tetelQuestions",
  "multiQuestions",
  "multiquestion",
];
