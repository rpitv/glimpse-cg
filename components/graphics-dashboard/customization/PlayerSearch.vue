<template>
  <div>
    <UInput
      v-model="search"
      class="mt-2 w-full"
      size="md"
      variant="outline"
      :placeholder="placeholder"
      @keydown.enter.prevent="onEnter"
    >
      <template #leading>
        <FontAwesomeIcon :icon="['fa', 'magnifying-glass']" class="inline-block align-middle" />
      </template>
    </UInput>

    <div class="max-height">
      <URadioGroup
        v-model="localSelected"
        :color="color"
        class="w-full mt-4"
        :items="items"
        label-key="name"
        variant="table"
        indicator="hidden"
        :ui="{
          item: '!rounded-none hover:bg-gray-100 dark:hover:bg-gray-800',
          root: 'h-[300px]',
        }"
        @update:model-value="onSelect"
      >
        <template #label="{ item }">
          <div class="flex items-center gap-2">
            <img :src="item.value!.image" alt="Player Image" class="w-12 h-12 object-cover rounded" />
            <div class="text-left">
              <div class="font-bold text-lg">
                <span>#{{ item.value!.number }}</span> {{ item.value!.name }}
              </div>
            </div>
          </div>
        </template>
      </URadioGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { PropType } from 'vue';

interface Player {
  height: string;
  hometown: string;
  image: string;
  name: string;
  number: string;
  weight: string;
  year: string;
}

const props = defineProps({
  players: { type: Array as PropType<Player[]>, required: true },
  color: { type: String, default: 'primary' },
  placeholder: { type: String, default: 'Search player' },
});

const emit = defineEmits(['selected', 'enter']);
const replicants = await useReplicants();

const search = ref('');
const localSelected = ref<Player | null>(null);
let cycleIndex = 0;

const values = computed(() => search.value.split(',').map(v => v.trim().toLowerCase()).filter(v => v !== ''));

const filtered = computed(() => {
  cycleIndex = 0;
  if (values.value.length === 0) return props.players;
  const filteredList = props.players.filter(player =>
    values.value.some(value => player.name.toLowerCase().includes(value) || player.number === value),
  );
  return filteredList.sort((a, b) => {
    const aIndex = values.value.findIndex(value => a.name.toLowerCase().includes(value) || a.number === value);
    const bIndex = values.value.findIndex(value => b.name.toLowerCase().includes(value) || b.number === value);
    return aIndex - bIndex;
  });
});

const items = computed(() => filtered.value.map(player => ({ name: player.name, value: { ...player } })));

function onSelect(val: Player | null) {
  localSelected.value = val;
  if (val) emit('selected', val);
}

function onEnter() {
  if (filtered.value.length > 0 && search.value.trim() !== '') {
    const p = filtered.value[cycleIndex]!
    localSelected.value = p;
    if (replicants.channels[0]!.playerBio)
      cycleIndex++;
    emit('selected', p);
    if (cycleIndex >= filtered.value.length) cycleIndex = 0;
  }
  emit('enter');
}
</script>

<style scoped>
.max-height { max-height: 45vh; overflow-y: auto; }
</style>
