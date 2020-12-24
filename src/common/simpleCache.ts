interface SimpleCache {
  get<T>(key: string): T;
  set(key: string, value: any, timeInMs?: number): void;
  has(key: string): boolean;
}

interface CacheValue {
  current: any;
  added: number;
  expiry: null | number;
}

export function createCache(
  initialValue: Record<string, any>,
  defaultExpiry: number = 10000
): SimpleCache {
  const cache: Record<string, CacheValue> = {};
  const now = Date.now();

  for (const key of Object.keys(initialValue)) {
    cache[key] = {
      current: initialValue[key],
      added: now,
      expiry: defaultExpiry,
    };
  }

  function has(key: string): boolean {
    if (!(key in cache)) {
      return false;
    }
    const now = Date.now();
    const element = cache[key];
    if (!element.expiry) {
      return true;
    }

    if (now - element.added > element.expiry) {
      delete cache[key];
      return false;
    }
    return true;
  }

  function get<T extends any = any>(key: string): T | undefined {
    if (!has(key)) {
      return undefined;
    }
    return cache[key].current;
  }

  function set(key: string, value: any, expiry: number = defaultExpiry): void {
    cache[key] = {
      current: value,
      added: Date.now(),
      expiry,
    };
  }

  return {
    get,
    set,
    has,
  };
}
