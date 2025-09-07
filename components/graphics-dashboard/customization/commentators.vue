<template>
  <div>
    <UFormField label="Offset X" help="Adjust the horizontal position of the bug. Positive values move it to the right, negative values to the left.">
      <DebouncedInputNumber v-model="commentators.offsetX" :step="0.1" :format-options="{ minimumFractionDigits: 1 }" />
    </UFormField>
    <UFormField class="mt-4" label="Offset Y" help="Adjust the vertical position of the bug. Positive values move it up, negative values down.">
      <DebouncedInputNumber v-model="commentators.offsetY" :step="0.1" :format-options="{ minimumFractionDigits: 1 }" />
    </UFormField>
    <USeparator class="mt-2" size="md" />
    <div v-if="!commentatorsRef.length" class="mt-2 flex flex-col items-center justify-center">
      <i>There are no commentators at the moment</i>
      <UButton @click="addCommentator">Add Commentator</UButton>
    </div>
    <div class="mt-2" v-else>
      <div class="flex justify-end mb-2">
        <UButton @click="addCommentator">Add Commentator</UButton>
      </div>
      <UTable :ui="{ tbody: 'my-table-tbody' }" :columns="columns" :data="commentatorsRef" class="table-fixed w-full">
        <template #commentator-cell="{ row }">
          <div style="min-width:140px; max-width: 320px;">
            <UFormField label="Name" help="The name of the commentator.">
              <DebouncedInput v-model="row.original.name" placeholder="Name" class="w-full" />
            </UFormField>
            <UPopover arrow>
              <UButton
                class="mt-2"
                label="Show Advanced Settings"
                variant="outline"
                block
              />
              <template #content>
                <div class="p-2" style="box-shadow: 0 4px 16px rgba(0,0,0,0.9); border-radius: 0.5rem;">
                  <UFormField class="mt-4" label="Color" help="The color for the commentator's name.">
                    <DebouncedInput v-model="row.original.nameColor" placeholder="Currently Default">
                      <template #leading>
                        <UPopover>
                          <span :style="`background-color: ${row.original.nameColor}`" class="size-5 rounded-full" />
                          <template #content>
                            <UColorPicker :throttle="500" v-model="row.original.nameColor" />
                          </template>
                        </UPopover>
                      </template>
                    </DebouncedInput>
                  </UFormField>
                  <UFormField class="mt-4" label="Name Size" help="Adjust the size of the commentator's name.">
                    <DebouncedInputNumber v-model="row.original.nameSize" :step="0.1" :format-options="{ minimumFractionDigits: 1 }" />
                  </UFormField>
                </div>
              </template>
            </UPopover>
          </div>
        </template>
        <template #description-cell="{ row }">
          <div v-if="configuration?.style !== 'espn'" style="min-width:140px; max-width: 320px;">
            <UFormField label="Description" help="A brief description or title for the commentator.">
              <DebouncedInput v-model="row.original.description" placeholder="Description" class="w-full" />
            </UFormField>
          </div>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-2">
            <UButton size="sm" color="error" @click="deleteCommentator(row.index)">Delete</UButton>
          </div>
        </template>
      </UTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DebouncedInput from '~/components/DebouncedInput.vue';
import DebouncedInputNumber from '~/components/DebouncedInputNumber.vue';
import { type Configuration, type LowerThird, Commentator } from '~/types/replicants';
import { useSortable } from "@vueuse/integrations/useSortable.mjs"

const lowerThird = await useReplicant<LowerThird>("lowerThird");
const configuration = await useReplicant<Configuration>("configuration");
const commentators = computed(() => lowerThird.value!.commentators);
const commentatorsRef = ref<Commentator[]>(lowerThird.value!.commentators.people);

const columns = [
  {
    accessorKey: "commentator",
    header: "Commentator",
  },
];

if (configuration.value?.style !== 'espn') {
  columns.push({
    accessorKey: "description",
    header: "Description",
  });
}
columns.push({
  accessorKey: "actions",
  header: "Actions",
});

function addCommentator() {
  commentatorsRef.value.push(new Commentator());
}

function deleteCommentator(index: number) {
  commentatorsRef.value.splice(index, 1);
}

useSortable(".my-table-tbody", commentatorsRef, { animation: 150 });

watch(commentatorsRef, (newVal) => {
  lowerThird.value!.commentators.people = newVal;
}, { deep: true });

</script>

<style>
</style>