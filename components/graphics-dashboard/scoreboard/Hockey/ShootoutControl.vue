<template>
  <UCard class="rounded-none">
    <template #header>
      <USwitch v-model="channels[0]!.shootout" label="Scorebug Control" size="xl" :ui="{
        label: 'text-2xl',
      }" description="Turn on or off shootouts" />
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const replicants = await useReplicants();
const channels = replicants.channels;
</script>

<style>

</style>