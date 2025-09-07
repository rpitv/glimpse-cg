<template>
  <div>
    <div v-if="!credits.credit.length" class="flex flex-col items-center justify-center">
      <i>There no credits at the moment</i>
      <UButton @click="addCredit">Add Credit</UButton>
    </div>
    <div v-else>
      <div class="flex justify-end mb-2">
        <UButton @click="addCredit">Add Credit</UButton>
      </div>
      <UTable :ui="{ tbody: 'my-table-tbody' }" :columns :data="credits.credit" class="table-fixed w-full">
        <template #title-cell="{ row }">
          <div style="min-width:140px; max-width: 320px;">
            <UFormField label="Role Title" help="The title of the role.">
              <DebouncedInput v-model="row.original.title" placeholder="Title of the role" class="w-full" />
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
                  <UFormField class="mt-4" label="Color" help="The color for the role title.">
                    <DebouncedInput v-model="row.original.titleColor" placeholder="Currently Default">
                      <template #leading>
                        <UPopover>
                          <span :style="`background-color: ${row.original.titleColor}`" class="size-5 rounded-full" />
                          <template #content>
                            <UColorPicker :throttle="500" v-model="row.original.titleColor" />
                          </template>
                        </UPopover>
                      </template>
                    </DebouncedInput>
                  </UFormField>
                  <UFormField class="mt-4" label="Name Size" help="Adjust the size of the role title.">
                    <DebouncedInputNumber v-model="row.original.titleSize" :step="0.1" :format-options="{
                      minimumFractionDigits: 1,
                    }" />
                  </UFormField>
                </div>
              </template>
            </UPopover>
          </div>
        </template>
        <template #people-cell="{ row }">
          <div style="min-width:140px; max-width: 320px;">
            <UFormField label="People" help="The people for this role.">
              <DebouncedInputTags v-model="row.original.people" placeholder="Add a person" class="w-full" />
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
                  <UFormField class="mt-4" label="Color" help="The color for the credit title.">
                    <DebouncedInput v-model="row.original.peopleColor" placeholder="Currently Default">
                      <template #leading>
                        <UPopover>
                          <span :style="`background-color: ${row.original.peopleColor}`" class="size-5 rounded-full" />
                          <template #content>
                            <UColorPicker :throttle="500" v-model="row.original.peopleColor" />
                          </template>
                        </UPopover>
                      </template>
                    </DebouncedInput>
                  </UFormField>
                  <UFormField class="mt-4" label="Name Size" help="Adjust the size of the credit title.">
                    <DebouncedInputNumber v-model="row.original.peopleSize" :step="0.1" :format-options="{
                      minimumFractionDigits: 1,
                    }" />
                  </UFormField>
                </div>
              </template>
            </UPopover>
          </div>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex gap-2 justify-end">
            <UButton size="sm" color="error" @click="creditsRef.splice(row.index, 1)">Delete</UButton>
          </div>
        </template>
      </UTable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type Fullscreen, Credit } from '~/types/replicants';
import { useSortable } from "@vueuse/integrations/useSortable.mjs"

const fullscreen = await useReplicant<Fullscreen>("fullscreen");
const credits = computed(() => fullscreen.value!.credits);
const creditsRef = ref<Credit[]>(fullscreen.value!.credits.credit)
const columns = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "people",
    header: "People",
  },
  {
    accessorKey: "actions",
    header: "Actions",
  }
]

function addCredit() {
  creditsRef.value.push(new Credit());
}

useSortable(".my-table-tbody", creditsRef, { animation: 150 });

watch(creditsRef, (newVal) => {
  fullscreen.value!.credits.credit = newVal;
}, { deep: true });

</script>

<style>

</style>