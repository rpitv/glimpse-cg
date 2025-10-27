<template>
  <div>
    <div class="flex justify-end mb-2">
      <UModal title="Add a custom graphic" description="Add a custom graphic by either uploading it from your computer, or providing a URL to it" v-model:open="modalState">
        <UButton>Add Graphic</UButton>
        <template #body>
          <UFileUpload @change="fileUpload" v-model="graphicFile" label="Upload/Drop your graphic here"></UFileUpload>
          <USeparator class="mt-2">OR</USeparator>
          <div class="p-2">
            <UFormField label="Image URL" help="Enter the URL of the custom graphic image.">
              <UInput v-model="graphicUrl" placeholder="https://example.com/graphic.png" class="w-full" />
            </UFormField>
            <div class="flex justify-end mt-4">
              <UButton @click="addGraphic(graphicUrl)" :disabled="!graphicUrl">Add Graphic</UButton>
            </div>
          </div>
        </template>
      </UModal>
    </div>
    <table class="w-full">
      <thead>
        <tr>
          <th class="text-left p-2">Preview</th>
          <th class="p-2">Actions</th>
        </tr>
      </thead>
      <tbody class="my-table-tbody">
        <tr
          v-if="customGraphicsRef.length > 0"
          v-for="(graphic, index) in customGraphicsRef"
          :key="index"
          :class="{ 'selected-row': graphicsStore.selectedGraphic.id === graphic._id }"
          @click="selectRow(index)"
          style="cursor: pointer;"
        >
          <td class="p-2">
            <img :src="graphic.imagePath" alt="Preview Image" class="w-full h-auto rounded-md custom-graphic"/>
          </td>
          <td class="p-2">
            <div class="flex justify-center gap-2">
              <UButton @click.stop="toggleCustomGraphic(index)" variant="outline" :color="channelsRef[index]?.show ? 'neutral' : 'primary'">
                {{ channelsRef[index]?.show ? 'Hide' : 'Show' }}
              </UButton>
              <UButton color="error" variant="outline" @click.stop="confirmDelete(index)">Delete</UButton>
            </div>
          </td>
        </tr>
        <tr v-else>
          <td colspan="2" class="text-center p-4 text-gray-500">No graphics added yet. Click "Add Graphic" to add one.</td>
        </tr>
      </tbody>
    </table>
    <UModal v-model:open="deleteModalState" title="Confirm Delete">
      <template #body>
        <div>Are you sure you want to delete this graphic?</div>
        <div class="flex justify-end gap-2 mt-4">
          <UButton @click="deleteModalState = false" variant="outline">Cancel</UButton>
          <UButton color="error" @click="performDelete">Delete</UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import { CustomGraphic } from '~/types/replicants';
import { useGraphicsStore } from '~/store/graphics';
import customgraphics from './customgraphics.vue';

const toast = useToast();
const graphicsStore = useGraphicsStore();
const replicants = await useReplicants();
const fullscreen = replicants.fullscreen;
const customGraphicsRef = computed({
  get: () => fullscreen.custom,
  set: (val) => (fullscreen.custom = val),
});
const channelsRef = computed({
  get: () => replicants.channels[0]!.custom,
  set: (val) => (replicants.channels[0]!.custom = val),
});

const modalState = ref(false);
const graphicFile = ref<File | null>(null);
const graphicUrl = ref("");
const deleteModalState = ref(false);
const deleteIndex = ref<number | null>(null);

const selectRow = (index: number) => {
  if (index !== null) {
    const graphic = customGraphicsRef.value[index]!;
    graphicsStore.setGraphic({ component: markRaw(customgraphics), name: 'customgraphic', id: graphic._id });
  } else {
    graphicsStore.setGraphic({ component: null, name: '', id: null });
  }
}

function addGraphic(url: string) {
  if (url) {
    const newGraphic = new CustomGraphic(url);
    customGraphicsRef.value = [...customGraphicsRef.value, newGraphic];
    graphicUrl.value = "";
    modalState.value = false;
    addCustomGraphic(newGraphic._id);
    toast.add({
      title: 'Graphic Added',
      description: 'The custom graphic has been added successfully.',
      color: 'success',
    });
  }
}

function fileUpload() {
  if (graphicFile.value) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const base64Url = e.target?.result as string;
      const newGraphic = new CustomGraphic(base64Url);
      customGraphicsRef.value = [...customGraphicsRef.value, newGraphic];
      addCustomGraphic(newGraphic._id);
    };
    reader.readAsDataURL(graphicFile.value);
    toast.add({
      title: 'Graphic Added',
      description: 'The custom graphic has been added successfully.',
      color: 'success',
    });
    graphicFile.value = null;
    graphicUrl.value = "";
    modalState.value = false;
  }
}


function confirmDelete(index: number) {
  deleteIndex.value = index;
  deleteModalState.value = true;
}

function performDelete() {
  if (deleteIndex.value !== null) {
    deleteCustomGraphic(customGraphicsRef.value[deleteIndex.value]!._id);
    if (graphicsStore.selectedGraphic.id === customGraphicsRef.value[deleteIndex.value]!._id) {
      graphicsStore.setGraphic({ component: null, name: 'customgraphic', id: null });
    }
    customGraphicsRef.value = customGraphicsRef.value.filter((_, i) => i !== deleteIndex.value);
    deleteIndex.value = null;
    deleteModalState.value = false;
    toast.add({
      title: 'Graphic Deleted',
      description: 'The custom graphic has been deleted.',
      color: 'success',
    });
  }
}

function addCustomGraphic(id: string) {
  replicants.channels[0]!.custom = [
    ...(replicants.channels[0]!.custom || []),
    {
      id,
      show: false,
    },
  ];
}

async function toggleCustomGraphic(index: number) {
  replicants.channels[0]!.custom[index]!.show = !replicants.channels[0]!.custom[index]!.show;
  replicants.channels[0]!.custom = [...replicants.channels[0]!.custom];
}

function deleteCustomGraphic(id: string) {
  channelsRef.value = channelsRef.value.filter(g => g.id !== id);
}
</script>

<style scoped>
.custom-graphic {
  max-width: 400px;
}

td {
  border-top: 1px solid rgb(160 160 160);
  padding: 8px 10px;
}
/* Highlight selected row for dark mode (Nuxt UI) */
.selected-row {
  background-color: rgba(80, 120, 255, 0.18); /* Soft blue with transparency */
  transition: background 0.2s;
}

/* Hover effect for table rows */
.my-table-tbody tr:not(.selected-row):hover {
  background-color: rgba(80, 120, 255, 0.10); /* Lighter blue for hover */
  transition: background 0.2s;
}
</style>