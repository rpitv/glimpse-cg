<template>
  <div>
    <div class="flex justify-end mb-2">
      <UButton @click="addCredit">
        Add Credit
      </UButton>
    </div>
    <div v-show="false">
      {{ creditsRef }}
    </div>
    <table class="w-full">
      <thead>
        <tr>
          <th class="text-left p-2">
            Title
          </th>
          <th class="text-left p-2">
            People
          </th>
          <th class="text-right p-2">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="my-table-tbody">
        <tr
          v-for="(credit, index) in creditsRef"
          :key="index"
          class="border-t border-muted"
        >
          <td>
            <div class="w-full">
              <UFormField
                label="Role Title"
                help="The title of the role."
              >
                <UInput
                  v-model="creditsRef[index]!.title"
                  placeholder="Title of the role"
                  class="w-full"
                />
              </UFormField>
              <UPopover arrow>
                <UButton
                  class="mt-2"
                  label="Show Advanced Settings"
                  variant="outline"
                  block
                />
                <template #content>
                  <div
                    class="p-2"
                    style="box-shadow: 0 4px 16px rgba(0,0,0,0.9); border-radius: 0.5rem;"
                  >
                    <ColorPicker
                      v-model="creditsRef[index]!.titleColor"
                      label="Title Color"
                      help="The color for the title."
                      @update:model-value="creditsRef = creditsRef"
                    />
                    <UFormField
                      class="mt-4"
                      label="Name Size"
                      help="Adjust the size of the role title."
                    >
                      <UInputNumber
                        v-model="creditsRef[index]!.titleSize"
                        :step="0.1"
                        :format-options="{
                          minimumFractionDigits: 1,
                        }"
                        @update:model-value="creditsRef = creditsRef"
                      />
                    </UFormField>
                  </div>
                </template>
              </UPopover>
            </div>
          </td>
          <td>
            <UFormField
              label="People"
              help="The people for this role."
            >
              <UInputTags
                v-model="creditsRef[index]!.people"
                placeholder="Add a person"
                class="w-full"
              />
            </UFormField>
            <UPopover arrow>
              <UButton
                class="mt-2"
                label="Show Advanced Settings"
                variant="outline"
                block
              />
              <template #content>
                <div
                  class="p-2"
                  style="box-shadow: 0 4px 16px rgba(0,0,0,0.9); border-radius: 0.5rem;"
                >
                  <ColorPicker
                    v-model="creditsRef[index]!.peopleColor"
                    label="People Text Color"
                    help="The color for the people text."
                  />
                  <UFormField
                    class="mt-4"
                    label="Name Size"
                    help="Adjust the size of the names of the people."
                  >
                    <UInputNumber
                      v-model="creditsRef[index]!.peopleSize"
                      :step="0.1"
                      :format-options="{
                        minimumFractionDigits: 1,
                      }"
                    />
                  </UFormField>
                </div>
              </template>
            </UPopover>
          </td>
          <td>
            <div class="flex gap-2 justify-end">
              <UButton
                size="sm"
                color="error"
                @click="deleteCredit(index)"
              >
                Delete
              </UButton>
            </div>
          </td>
        </tr>
        <tr v-if="creditsRef.length === 0">
          <td
            colspan="3"
            class="text-center p-4 text-gray-500"
          >
            No credits added yet. Click "Add Credit" to add one.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { Credit } from '~/types/replicants';
import { useSortable } from '@vueuse/integrations/useSortable.mjs';

const replicants = await useReplicants();
const credits = replicants.fullscreen.credits;
const creditsRef = computed({
  get: () => credits.credit,
  set: val => (credits.credit = val),
});

function addCredit() {
  creditsRef.value = [...creditsRef.value, new Credit()];
}
function deleteCredit(index: number) {
  creditsRef.value = creditsRef.value.filter((_, i) => i !== index);
}

const sortableInstance = useSortable('.my-table-tbody', creditsRef, { animation: 150 });

watch(creditsRef, () => {
  if (creditsRef.value.length === 0) {
    sortableInstance.stop();
  }
  else {
    sortableInstance.start();
  }
}, { immediate: true });
</script>

<style scoped>
td {
  padding: 8px 10px;
}
</style>
