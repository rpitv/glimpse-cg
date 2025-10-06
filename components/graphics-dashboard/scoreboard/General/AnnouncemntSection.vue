<template>
  <div>
    <b class="text-xl text-muted">{{ name.toLocaleUpperCase() }}</b>
    <table class="w-full">
      <colgroup>
        <col span="1" style="width: 40%;">
        <col span="1" style="width: 30%;">
        <col span="1" style="width: 30%;">
      </colgroup>
      <thead>
        <tr>
          <th class="text-left">Message</th>
          <th class="text-left">Timer</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody class="my-table-tbody">
        <tr v-for="(announcement, index) in announcmentRef" :key="index">
          <td>
            {{ announcement.message }}
          </td>
          <td>
            <p v-if="announcement.timer">
              {{ millisToString((announcement.timer!.length) - (announcement.timer!.startedAt - replicants.scoreboard.clock.time)) }}
            </p>
            <p v-else class="text-muted">No Timer</p>
          </td>
          <td>
            <div class="flex gap-2 justify-center">
              <UButton color="secondary" @click="openModal(index)" class="rounded-full">
                <template #leading>
                  <FontAwesomeIcon size="lg" :icon="'pen-to-square'" />
                </template>
              </UButton>
              <UButton color="error" @click="deleteAnnouncement(index)" class="rounded-full">
                <template #leading>
                  <FontAwesomeIcon icon="trash" />
                </template>
              </UButton>
            </div>
          </td>
        </tr>
        <tr v-if="announcmentRef.length === 0">
          <td class="text-center text-muted w-full" colspan="3">
            There are no announcements. Use the bottom row to add one.
          </td>
        </tr>
      </tbody>
    </table>
    <table>
      <tbody>
        <tr>
          <td>
            <UInput @keydown.enter="addAnnouncement()" v-model="announcementMessage" class="w-full" placeholder="Announcement Message" />
          </td>
          <td>
            <UInput
              @keydown.enter="addAnnouncement()"
              class="w-full"
              placeholder="MM:SS or SS"
              v-model="time"
              :ui="{ base: 'text-center' }"
            />
          </td>
          <td class="text-center">
            <UButton @click="addAnnouncement()" class="rounded-full">
              <template #leading>
                <FontAwesomeIcon icon="plus" />
              </template>
            </UButton>
          </td>
        </tr>
      </tbody>
    </table>
    <UModal v-model:open="modalState" title="Edit Announcement" description="Edit the announcement message and timer." :ui="{
      footer: 'flex justify-between',
    }">
      <template #body>
        <UFormField label="Announcement Message">
          <UInput
            @keydown.enter="editAnnouncement()"
            v-model="editedMessage"
            class="w-full mb-4"
            placeholder="Announcement Message"
          />
        </UFormField>
        <UFormField label="Timer (MM:SS or SS)">
          <UInput
            @keydown.enter="editAnnouncement()"
            v-model="editedTimer"
            placeholder="MM:SS or SS"
            :ui="{ base: 'text-center' }"
          />
        </UFormField>
      </template>
      <template #footer>
        <UButton size="xl" color="neutral" @click="cancelEdit">Cancel</UButton>
        <UButton size="xl" color="secondary" @click="editAnnouncement">Edit</UButton>
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import { Announcement, type AnnouncementTimer } from '#imports';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useSortable } from '@vueuse/integrations/useSortable.mjs';
import { millisToString } from '~/utils/milisToString';
import { parseTimeString } from '~/utils/parseTimeString';

const toast = useToast();
const replicants = await useReplicants();
const scoreboard = replicants.scoreboard;

const props = defineProps<{
  section: {
    announcement: Announcement[]
  },
  name: 'Away' | 'Home' | 'Global'
}>();

const announcmentRef = computed({
  get: () => {
    return props.section.announcement
  },
  set: (val: Announcement[]) => {
    props.section.announcement = val;
  }
});

const announcementMessage = ref('');
const time = ref('');
const modalState = ref(false);
const openedAnnouncement = ref(-1);
const editedMessage = ref('');
const editedTimer = ref('');

function addAnnouncement(message: string = announcementMessage.value, timer: string = time.value) {
  if (message.trim() === '') {
    toast.add({
      title: 'Error',
      description: 'Announcement message cannot be empty.',
      color: 'error'
    });
    return;
  }
  let totalTime = -1;
  if (timer.trim() !== '') {
    try {
      totalTime = parseTimeString(timer);
    } catch (e) {
      toast.add({
        title: 'Error',
        description: (e as Error).message,
        color: 'error'
      });
      return;
    }
  }
  const announcementTimer: AnnouncementTimer = {
    length: totalTime,
    startedAt: replicants.scoreboard.clock.time,
    timerEndsAction: 'removeAnnouncement',
    visible: true
  }
  announcmentRef.value.push(new Announcement(announcementMessage.value, (totalTime > 0 ? announcementTimer : undefined)));

  time.value = '';
  announcementMessage.value = '';
  toast.add({
    title: 'Success',
    description: 'Announcement added successfully.',
    color: 'primary'
  });
}

function editAnnouncement() {
  props.section.announcement[openedAnnouncement.value]!.message = editedMessage.value;
  if (editedTimer.value.trim() === '') {
    props.section.announcement[openedAnnouncement.value]!.timer = null;
  } else {
    let totalTime = -1;
    try {
      totalTime = parseTimeString(editedTimer.value);
    } catch (e) {
      toast.add({
        title: 'Error',
        description: (e as Error).message,
        color: 'error'
      });
      return;
    }
    props.section.announcement[openedAnnouncement.value]!.timer = {
      length: totalTime,
      startedAt: replicants.scoreboard.clock.time,
      timerEndsAction: 'removeAnnouncement',
      visible: true
    }
  }
  openedAnnouncement.value = -1;
  modalState.value = false;
  toast.add({
    title: 'Success',
    description: 'Announcement edited successfully.',
    color: 'secondary'
  });
}

function deleteAnnouncement(index: number) {
  announcmentRef.value.splice(index, 1);
  toast.add({
    title: 'Success',
    description: 'Announcement deleted successfully.',
    color: 'success'
  });
}

function cancelEdit() {
  openedAnnouncement.value = -1;
  modalState.value = false;
}

function openModal(index: number) {
  openedAnnouncement.value = index;
  editedMessage.value = props.section.announcement[openedAnnouncement.value]!.message;
  if (props.section.announcement[openedAnnouncement.value]!.timer) {
    editedTimer.value = millisToString(props.section.announcement[openedAnnouncement.value]!.timer!.length);
  } else {
    editedTimer.value = '';
  }
  modalState.value = true;
}

let sortableInstance = useSortable(".my-table-tbody", announcmentRef, { animation: 150 });

</script>

<style scoped>
td {
  border: 1px solid rgb(243, 243, 243, 0.2);
  padding: 20px;
}
</style>