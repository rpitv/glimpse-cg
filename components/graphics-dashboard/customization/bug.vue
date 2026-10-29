<template>
  <div>
    <UFormField
      label="Offset X"
      help="Adjust the horizontal position of the bug. Positive values move it to the right, negative values to the left."
    >
      <UInputNumber
        v-model="bug.offsetX"
        :step="0.1"
        :format-options="{
          minimumFractionDigits: 1,
        }"
      />
    </UFormField>
    <UFormField
      class="mt-4"
      label="Offset Y"
      help="Adjust the vertical position of the bug. Positive values move it up, negative values down."
    >
      <UInputNumber
        v-model="bug.offsetY"
        :step="0.1"
        :format-options="{
          minimumFractionDigits: 1,
        }"
      />
    </UFormField>
    <UFormField
      v-if="configuration.style === 'sny'"
      class="mt-4"
      label="Opacity"
      help="Adjust the opacity of the bug. 0 is fully transparent, 1 is fully opaque."
    >
      <UInputNumber
        v-model="bug.opacity"
        :step="0.01"
        :format-options="{
          minimumFractionDigits: 1,
        }"
      />
    </UFormField>
  </div>
</template>

<script lang="ts" setup>
const replicants = await useReplicants();
const bug = replicants.lowerThird.bug;
const configuration = replicants.configuration
</script>

<style>

</style>
