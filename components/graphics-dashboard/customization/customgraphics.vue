<template>
  <div>
    <div class="flex justify-end mb-2">
      <UModal
        v-model:open="modalState"
        title="Add a custom graphic"
        description="Add a custom graphic by either uploading it from your computer, or providing a URL to it"
      >
        <UButton>Add Graphic</UButton>
        <template #body>
          <UFileUpload
            v-model="graphicFile"
            label="Upload/Drop your graphic here"
            @change="fileUpload"
          />
          <USeparator class="mt-2">
            OR
          </USeparator>
          <div class="p-2">
            <UFormField
              label="Image URL"
              help="Enter the URL of the custom graphic image."
            >
              <UInput
                v-model="graphicUrl"
                placeholder="https://example.com/graphic.png"
                class="w-full"
              />
            </UFormField>
            <div class="flex justify-end mt-4">
              <UButton
                :disabled="!graphicUrl"
                @click="addGraphic(graphicUrl)"
              >
                Add Graphic
              </UButton>
            </div>
          </div>
        </template>
      </UModal>
    </div>
    <table class="w-full">
      <thead>
        <tr>
          <th class="text-left p-2">
            Preview
          </th>
          <th class="p-2">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="my-table-tbody">
        <tr
          v-for="(graphic, i) in fullscreen.custom"
          v-if="fullscreen.custom.length > 0"
          :key="i"
          :class="{ 'selected-row': graphicsStore.selectedGraphic.index === i }"
          style="cursor: pointer;"
          @click="selectRow(i)"
        >
          <td class="p-2">
            <img
              :src="fullscreen.custom[i]!.imagePath"
              alt="Preview Image"
              class="w-full h-auto rounded-md custom-graphic"
            >
          </td>
          <td class="p-2">
            <div class="flex justify-center gap-2">
              <UButton
                variant="outline"
                :color="channel0!.custom[i]?.show ? 'neutral' : 'primary'"
                @click.stop="toggleCustomGraphic(i)"
              >
                {{ channel0!.custom[i]?.show ? 'Hide' : 'Show' }}
              </UButton>
              <UButton
                color="error"
                variant="outline"
                @click.stop="confirmDelete(i)"
              >
                Delete
              </UButton>
            </div>
          </td>
        </tr>
        <tr v-else>
          <td
            colspan="2"
            class="text-center p-4 text-gray-500"
          >
            No graphics added yet. Click "Add Graphic" to add one.
          </td>
        </tr>
      </tbody>
    </table>
    <UModal
      v-model:open="deleteModalState"
      title="Confirm Delete"
    >
      <template #body>
        <div>Are you sure you want to delete this graphic?</div>
        <div class="flex justify-end gap-2 mt-4">
          <UButton
            variant="outline"
            @click="deleteModalState = false"
          >
            Cancel
          </UButton>
          <UButton
            color="error"
            @click="performDelete"
          >
            Delete
          </UButton>
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
const channel0 = replicants.channels[0]!;

const modalState = ref(false);
const graphicFile = ref<File | null>(null);
const graphicUrl = ref('');
const deleteModalState = ref(false);
const deleteIndex = ref<number | null>(null);

const selectRow = (index: number) => {
  if (index !== null) {
    graphicsStore.setGraphic({ component: markRaw(customgraphics), name: 'customgraphic', index });
  }
  else {
    graphicsStore.setGraphic({ component: null, name: '', index: -1 });
  }
};

function addGraphic(url: string) {
  if (url) {
    const newGraphic = new CustomGraphic(url);
    fullscreen.custom.push(newGraphic);
    graphicUrl.value = '';
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
    const formData = new FormData();
    formData.append('file', graphicFile.value);

    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then((data) => {
        const imagePath = `/api/cache/${data.filename}`;
        const newGraphic = new CustomGraphic(imagePath);
        fullscreen.custom = [...fullscreen.custom, newGraphic];
        addCustomGraphic(newGraphic._id);
        toast.add({
          title: 'Graphic Added',
          description: 'The custom graphic has been added successfully.',
          color: 'success',
        });
        graphicFile.value = null;
        graphicUrl.value = '';
        modalState.value = false;
      })
      .catch((error) => {
        console.error('Upload failed:', error);
        toast.add({
          title: 'Upload Failed',
          description: 'Failed to upload the graphic.',
          color: 'error',
        });
      });
  }
}

function confirmDelete(index: number) {
  deleteIndex.value = index;
  deleteModalState.value = true;
}

function performDelete() {
  if (deleteIndex.value !== null) {
    deleteCustomGraphic(fullscreen.custom[deleteIndex.value]!._id);
    if (graphicsStore.selectedGraphic.index === deleteIndex.value) {
      graphicsStore.setGraphic({ component: customgraphics, name: 'customgraphic', index: -1 });
    }
    fullscreen.custom = fullscreen.custom.filter((_, i) => i !== deleteIndex.value);
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
  channel0.custom = [
    ...(channel0.custom || []),
    {
      id,
      show: false,
    },
  ];
}

async function toggleCustomGraphic(index: number) {
  channel0.custom[index]!.show = !channel0.custom[index]!.show;
  channel0.custom = [...channel0.custom];
}

function deleteCustomGraphic(id: string) {
  channel0.custom = channel0.custom.filter(g => g.id !== id);
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
