import { ref, watch, onMounted } from 'vue';
import { socket } from "~/utils/socket"


export function useReplicant<T>(channel: string = 'default', name: string) {
  const value = ref<T | null>(null);

  onMounted(() => {
    socket.emit('replicant:subscribe', { channel, name });
    socket.on(`replicant:update:${channel}:${name}`, (incoming: T) => {
      if (JSON.stringify(value.value) !== JSON.stringify(incoming)) {
        value.value = incoming;
      }
    });
  });

  watch(value, (newVal) => {
    if (newVal !== null) {
      socket.emit('replicant:set', { channel, name, value: newVal });
    }
  }, { deep: true });

  return value;
}