import { existsSync } from 'fs';
import { getValue, setValue } from '../server/utils/db';
import { type Replicants, defaultReplicants } from '~/types/replicants';

// 🔹 Deep merge utility
function deepMerge<T>(target: T, source: Partial<T>): T {
  for (const key of Object.keys(source)) {
    const tVal = (target as any)[key];
    const sVal = (source as any)[key];

    if (Array.isArray(sVal)) {
      ;(target as any)[key] = sVal.slice();
    }
    else if (
      sVal
      && typeof sVal === 'object'
      && tVal
      && typeof tVal === 'object'
    ) {
      deepMerge(tVal, sVal);
    }
    else {
      ;(target as any)[key] = sVal;
    }
  }
  return target;
}

// 🔹 Initial state: DB or defaults
let state: Replicants;

if (existsSync('replicants.db')) {
  const stored = getValue('replicants');
  if (stored) {
    state = deepMerge(structuredClone(defaultReplicants), stored);
    setValue('replicants', state); // upgrade schema
  }
  else {
    state = structuredClone(defaultReplicants);
    setValue('replicants', state);
  }
}
else {
  state = structuredClone(defaultReplicants);
  setValue('replicants', state);
}

// 🔹 Subscribers (WebSocket clients)
const subscribers = new Set<(payload: any) => void>();

function notifySubscribers(payload: any) {
  for (const fn of subscribers) fn(payload);
}

function save() {
  setValue('replicants', state);
}

export function subscribe(fn: (payload: any) => void) {
  subscribers.add(fn);
  fn({ type: 'init', state }); // full state on connect
  return () => subscribers.delete(fn);
}

// 🔹 Proxy for deep reactive mutations
function makeProxy<T extends object>(obj: T, path: string[] = []): T {
  return new Proxy(obj, {
    get(target, key) {
      const value = Reflect.get(target, key);
      if (typeof value === 'object' && value !== null) {
        return makeProxy(value as any, [...path, String(key)]);
      }
      return value;
    },
    set(target, key, value) {
      const fullPath = [...path, String(key)];
      const result = Reflect.set(target, key, value);
      save();
      notifySubscribers({ type: 'patch', path: fullPath, value });
      return result;
    },
    deleteProperty(target, key) {
      const fullPath = [...path, String(key)];
      const result = Reflect.deleteProperty(target, key);
      save();
      notifySubscribers({ type: 'delete', path: fullPath });
      return result;
    },
  });
}

export const replicants = makeProxy(state);
