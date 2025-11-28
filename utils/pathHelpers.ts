import { EventEmitter } from 'events';

export const replicantEvents = new EventEmitter();

export function setDeep(obj: any, path: string[], value: any) {
  let target = obj;
  for (let i = 0; i < path.length - 1; i++) {
    if (typeof target[path[i]] !== 'object' || target[path[i]] === null) {
      target[path[i]] = {};
    }
    target = target[path[i]];
  }
  target[path[path.length - 1]] = value;
  replicantEvents.emit('change', path, value);
}

export function deleteDeep(obj: any, path: string[]) {
  let target = obj;
  for (let i = 0; i < path.length - 1; i++) {
    if (!target[path[i]]) return;
    target = target[path[i]];
  }

  const lastKey = path[path.length - 1];

  if (Array.isArray(target)) {
    const index = Number(lastKey);
    if (!isNaN(index)) {
      target.splice(index, 1); // ✅ array-safe deletion
    }
  }
  else {
    delete target[lastKey]; // ✅ object-safe deletion
  }
}
