<template>
  <div>
    <UFormField label="Offset X" help="Adjust the horizontal position of the bug. Positive values move it to the right, negative values to the left.">
    <DebouncedInputNumber v-model="bug.offsetX" :step="0.1" :format-options="{
        minimumFractionDigits: 1,
      }" />
    </UFormField>
    <UFormField class="mt-4" label="Offset Y" help="Adjust the vertical position of the bug. Positive values move it up, negative values down.">
    <DebouncedInputNumber v-model="bug.offsetY" :step="0.1" :format-options="{
        minimumFractionDigits: 1,
      }" />
    </UFormField>
  </div>
</template>

<script lang="ts" setup>
import type { LowerThird } from '~/types/replicants';

const lowerThird = await useReplicant<LowerThird>("lowerThird");
const bug = computed(() => lowerThird.value!.bug);

</script>

<style>

</style>