/**
 * Storage abstraction layer.
 * All domain data access goes through this interface so the
 * backend can be swapped from localStorage to Firebase/Firestore
 * without rewriting domain logic.
 */
export interface StorageService {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  keys(): string[];
}

/**
 * localStorage-based implementation.
 */
export class LocalStorageService implements StorageService {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

  keys(): string[] {
    const result: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) result.push(key);
    }
    return result;
  }
}

/** Singleton instance used throughout the app. */
export const storage: StorageService = new LocalStorageService();
