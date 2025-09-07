import { useDebounce } from "@vueuse/core";
import { socket } from "~/utils/socket";

const replicantCache = new Map<string, ReturnType<typeof ref>>();

export async function useReplicant<T>(name: string): Promise<ReturnType<typeof ref<T>>> {
  if (replicantCache.has(name)) {
    return replicantCache.get(name);
  }

  const value = ref<T | undefined>(undefined);

  let resolveFirst: ((v: typeof value) => void) | null = null;
  const firstValue = new Promise<typeof value>((resolve) => {
    resolveFirst = resolve;
  });

  // Listener function so we can later remove it
  const listener = (incoming: T) => {
    if (JSON.stringify(value.value) !== JSON.stringify(incoming)) {
      value.value = incoming;
      if (resolveFirst) {
        resolveFirst(value);
        resolveFirst = null;
      }
    }
  };

  socket.emit("replicant:subscribe", { name });
  socket.on(`replicant:update:${name}`, (incoming: T) => {
    if (JSON.stringify(value.value) !== JSON.stringify(incoming)) {
      value.value = incoming;
      if (resolveFirst) {
        resolveFirst(value);
        resolveFirst = null;
      }
    }
  });

  // Wait until the first value arrives
  await firstValue;
  await nextTick();

  const debounced = useDebounce(value, 300);

  // Now that we have the initial value, start watching for changes
  const stopWatcher = watch(
    debounced,
    (newVal) => {
      if (newVal !== undefined) {
        socket.emit("replicant:set", { name, value: newVal });
      }
    },
    { deep: true }
  );

  replicantCache.set(name, value);
  return value;
}