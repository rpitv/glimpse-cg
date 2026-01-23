<template>
  <UCard class="rounded-none">
    <template #header>
      <b class="text-2xl">Shootout Control</b>
      <div class="flex items-center gap-2 mt-2">
        <USwitch
          v-model="channels[0]!.shootout"
          size="xl"
          label="Display Shootout"
        />
        <UKbd :class="`${inputFocus.isInputFocused.value ? 'opacity-20' : 'opacity-100'} transition-all`">
          S
        </UKbd>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
const replicants = await useReplicants();
const channels = replicants.channels;
const inputFocus = useInputFocus();
</script>

<style>

</style>
