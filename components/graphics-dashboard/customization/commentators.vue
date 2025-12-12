<template>
  <div>
    <UFormField
      label="Offset X"
      help="Adjust the horizontal position of the commentators. Positive values move it to the right, negative values to the left."
    >
      <UInputNumber
        v-model="commentators.offsetX"
        :step="0.1"
        :format-options="{ minimumFractionDigits: 1 }"
      />
    </UFormField>
    <UFormField
      class="mt-4"
      label="Offset Y"
      help="Adjust the vertical position of the commentators. Positive values move it up, negative values down."
    >
      <UInputNumber
        v-model="commentators.offsetY"
        :step="0.1"
        :format-options="{ minimumFractionDigits: 1 }"
      />
    </UFormField>
    <USeparator
      class="mt-2"
      size="md"
    />
    <div class="mt-2">
      <div class="flex justify-end mb-2">
        <UButton @click="addCommentator">
          Add Commentator
        </UButton>
      </div>
      <p v-show="false">
      </p>
      <table class="w-full">
        <thead>
          <tr>
            <th>Commentator</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody class="my-table-tbody">
          <tr
            v-for="(commentator, index) in commentatorsRef"
            :key="index"
            class="border-t border-muted"
          >
            <td>
              <div class="w-full">
                <UFormField
                  label="Name"
                  help="The name of the commentator."
                >
                  <UInput
                    v-model="commentatorsRef[index]!.name"
                    placeholder="Name"
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
                        v-model="commentatorsRef[index]!.nameColor"
                        label="Name Color"
                        help="The color for the commentator's name."
                      />
                      <UFormField
                        class="mt-4"
                        label="Name Size"
                        help="Adjust the size of the commentator's name."
                      >
                        <UInputNumber
                          v-model="commentatorsRef[index]!.nameSize"
                          :step="0.1"
                          :format-options="{ minimumFractionDigits: 1 }"
                        />
                      </UFormField>
                    </div>
                  </template>
                </UPopover>
              </div>
            </td>
            <td>
              <div class="flex gap-2 justify-center">
                <UButton
                  size="sm"
                  color="error"
                  @click="deleteCommentator(index)"
                >
                  Delete
                </UButton>
              </div>
            </td>
          </tr>
          <tr v-if="commentatorsRef.length === 0">
            <td
              class="text-center text-muted w-full"
              colspan="3"
            >
              There are no commentators. Click "Add Commentator" to add one.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Commentator } from '~/types/replicants';
import { useSortable } from '@vueuse/integrations/useSortable.mjs';

const replicants = await useReplicants();
const commentators = replicants.lowerThird.commentators;
const commentatorsRef = computed({
  get: () => commentators.people,
  set: val => (commentators.people = val),
});

function addCommentator() {
  commentatorsRef.value.push(new Commentator());
}

function deleteCommentator(index: number) {
  commentatorsRef.value.splice(index, 1);
}

const sortableInstance = useSortable('.my-table-tbody', commentatorsRef, { animation: 150 });

watch(commentatorsRef, () => {
  if (commentatorsRef.value.length === 0) {
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
