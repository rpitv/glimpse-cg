import { ref, watch, onMounted } from 'vue';
import { socket } from "~/utils/socket"



import { nextTick } from 'vue';

export async function useReplicant<T>(name: string) {
  const value = ref<T | undefined>(undefined);

  let resolveFirst: ((v: typeof value) => void) | null = null;
  const firstValue = new Promise<typeof value>((resolve) => {
    resolveFirst = resolve;
  });


  socket.emit('replicant:subscribe', { name });
  socket.on(`replicant:update:${name}`, (incoming: T) => {
    if (JSON.stringify(value.value) !== JSON.stringify(incoming)) {
      value.value = incoming;
      if (resolveFirst) {
        resolveFirst(value);
        resolveFirst = null;
      }
    }
  });

  watch(value, (newVal) => {
    if (newVal !== undefined) {
      socket.emit('replicant:set', { name, value: newVal });
    }
  }, { deep: true });
  // Wait for the first value to be set before returning
  await firstValue;
  await nextTick();
  return value;
}