import { openDB, type IDBPDatabase } from "idb";
import type {
  PersistedClient,
  PersistedQuery,
} from "@tanstack/react-query-persist-client";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
export const DB_NAME = "AppCache";
const STORE_NAME = "queryCache";
export const CACHE_VERSION = "1.0.0";

interface CacheEntry {
  key: string;
  version: string;
  query: PersistedQuery;
  timestamp: number;
}

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
  "multiQuestionDetails",
  "groups",
];

async function initDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    },
  });
}

// Estimate quota and show warning if usage exceeds 80%
async function isStorageNearQuota(): Promise<boolean> {
  if (navigator.storage?.estimate) {
    try {
      const { usage, quota } = await navigator.storage.estimate();
      if (usage && quota) {
        const usageRatio = usage / quota;
        if (usageRatio > 0.8) {
          toast.warn(
            <div className="flex flex-col gap-2">
              <p className="mb-2">Tárhely megtelt. Kérlek ürítsd!</p>
              <button
                onClick={async () => {
                  await idbPersister.removeClient();
                  toast.dismiss("storage-warning");
                  toast.success("Tárhely ürítve.");
                }}
                aria-label="Clear cache"
                className="bg-red-600 hover:bg-red-700 hover:cursor-pointer text-white p-2 rounded-md flex   items-center justify-center"
              >
                <FaTrash className="w-5 h-5" />
              </button>
            </div>,
            {
              toastId: "storage-warning",
              autoClose: false,
              closeOnClick: false,
              closeButton: true,
              position: "bottom-right",
            }
          );
          return true;
        }
      }
    } catch (err) {
      console.warn("Could not estimate storage:", err);
    }
  }
  return false;
}
export const idbPersister = {
  persistClient: async (client: PersistedClient) => {
    try {
      const db = await initDB();

      const isNearLimit = await isStorageNearQuota();
      if (isNearLimit) {
        console.warn("Aborting persist: storage quota nearly full.");
        return; // 🛑 Skip caching to avoid eviction
      }

      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const now = Date.now();
      const maxAge = 1000 * 60 * 60 * 24; // 24 hours

      const existingEntries: CacheEntry[] = await store.getAll();
      const existingMap = new Map<string, CacheEntry>();
      for (const entry of existingEntries) {
        existingMap.set(entry.key, entry);
      }

      for (const query of client.clientState.queries) {
        const key = JSON.stringify(query.queryKey);
        if (!persistQueryKeys.includes(query.queryKey?.[0] as string)) continue;
        if (query.state.status !== "success" || query.state.data === undefined)
          continue;

        const existing = existingMap.get(key);
        const newEntry: CacheEntry = {
          key,
          version: CACHE_VERSION,
          query: {
            ...query,
            buster: CACHE_VERSION,
          },
          timestamp: now,
        };

        if (!existing || existing.timestamp < newEntry.timestamp) {
          await store.put(newEntry);
        }
      }

      for (const [key, entry] of existingMap.entries()) {
        if (entry.version !== CACHE_VERSION || now - entry.timestamp > maxAge) {
          await store.delete(key);
        }
      }

      await tx.done;
    } catch (error) {
      console.error("Failed to persist query client:", error);
    }
  },

  restoreClient: async (): Promise<PersistedClient | undefined> => {
    try {
      const db = await initDB();
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const now = Date.now();
      const maxAge = 1000 * 60 * 60 * 24;
      const validQueries: PersistedQuery[] = [];

      const entries: CacheEntry[] = await store.getAll();
      for (const entry of entries) {
        if (
          entry.version === CACHE_VERSION &&
          now - entry.timestamp <= maxAge
        ) {
          validQueries.push(entry.query);
        }
      }

      await tx.done;

      return {
        clientState: {
          queries: validQueries,
          mutations: [],
        },
        timestamp: now,
        buster: CACHE_VERSION,
      };
    } catch (error) {
      console.error("Failed to restore query client:", error);
      return undefined;
    }
  },

  removeClient: async () => {
    try {
      const db = await initDB();
      await db.clear(STORE_NAME);
      console.debug("Cleared IndexedDB store");
    } catch (error) {
      console.error("Failed to remove query client:", error);
    }
  },
};
