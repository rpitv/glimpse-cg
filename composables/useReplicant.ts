import { ref, watch, onMounted } from 'vue';
import { socket } from "~/utils/socket"


export function useReplicant<T>(name: string) {
  const value = ref<T | null>(null);

  onMounted(() => {
    socket.emit('replicant:subscribe', { name });
    socket.on(`replicant:update:${name}`, (incoming: T) => {
      if (JSON.stringify(value.value) !== JSON.stringify(incoming)) {
        value.value = incoming;
      }
    });
  });

  watch(value, (newVal) => {
    if (newVal !== null) {
      socket.emit('replicant:set', { name, value: newVal });
    }
  }, { deep: true });

  return value;
}