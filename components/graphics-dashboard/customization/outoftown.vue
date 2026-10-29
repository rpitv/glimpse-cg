<template>
  <div>
    <div class="flex flex-row-reverse gap-4 mr-6 items-center">
      <UButton :disabled="disableRefresh" @click="refresh">Refresh</UButton><span>Last Updated: {{ outOfTown.lastUpdated }}</span>
    </div>
    <UTable 
      :loading="outOfTown.loading"
      :data="outOfTown.teams"
      :columns="[
        {
          header: 'Show',
          cell: ({ row }) => row.original.show
        },
        {
          accessorKey: 'homeTeam',
          header: 'Home Team',
          cell: ({ row }) => row.original.details.homeTeam
        },
        {
          accessorKey: 'visitingTeam',
          header: 'Visiting Team',
          cell: ({ row }) => row.original.details.visitingTeam
        },
        {
          header: 'Date',
          cell: ({ row }) => row.original.details.date
        },
        {
          header: 'Score',
          cell: ({ row }) => row.original.details.score
        },
        {
          header: 'Clock',
          cell: ({ row }) => row.original.details.clock
        }
      ]"
    >
      <template #Show-cell="{row}">
        <UCheckbox v-model="outOfTown.teams[row.index]!.show" />
      </template>
      <template #homeTeam-cell="{row}">
        <UInput variant="soft" v-model="outOfTown.teams[row.index]!.details.homeTeam" />
      </template>
      <template #visitingTeam-cell="{row}">
        <UInput variant="soft" v-model="outOfTown.teams[row.index]!.details.visitingTeam" />
      </template>
      <template #Date-cell="{row}">
        <UInput variant="soft" v-model="outOfTown.teams[row.index]!.details.date" />
      </template>
      <template #Score-cell="{row}">
        <UInput variant="soft" v-model="outOfTown.teams[row.index]!.details.score" />
      </template>
      <template #Clock-cell="{row}">
        <UInput variant="soft" v-model="outOfTown.teams[row.index]!.details.clock" />
      </template>
    </UTable>
  </div>
</template>

<script lang="ts" setup>
const replicants = await useReplicants();
const outOfTown = replicants.fullscreen.outOfTown;
const disableRefresh = ref(false);

async function refresh() {
  disableRefresh.value = true;
  await $fetch('/api/outoftown/refresh', {
    method: 'POST'
  });
  disableRefresh.value = false;
}
</script>

<style>

</style>