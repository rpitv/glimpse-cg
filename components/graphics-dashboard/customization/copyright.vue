<template>
  <div>
    <UFormField label="Offset X" help="Adjust the horizontal position of the copyright. Positive values move it to the right, negative values to the left.">
      <UInputNumber v-model="copyright.offsetX" :step="0.1" :format-options="{
        minimumFractionDigits: 1,
      }" />
    </UFormField>
    <UFormField class="mt-4" label="Offset Y" help="Adjust the vertical position of the copyright. Positive values move it up, negative values down.">
      <UInputNumber v-model="copyright.offsetY" :step="0.1" :format-options="{
        minimumFractionDigits: 1,
      }" />
    </UFormField>
    <div class="mt-4">
      <UFormField label="Text" help="The text of the copyright.">
        <DebouncedInput v-model="copyright.text" placeholder="Currently Default" />
      </UFormField>
      <UFormField class="mt-4" label="Color" help="The color for the copyright text.">
        <DebouncedInput v-model="copyright.textColor" placeholder="Currently Default">
          <template #leading>
            <UPopover>
              <span :style="`background-color: ${copyright.textColor}`" class="size-5 rounded-full" />
              <template #content>
                <UColorPicker :throttle="500" v-model="copyright.textColor" />
              </template>
            </UPopover>
          </template>
        </DebouncedInput>
      </UFormField>
      <UFormField class="mt-4" label="Name Size" help="Adjust the size of the copyright text.">
        <DebouncedInputNumber v-model="copyright.textSize" :step="0.1" :format-options="{
          minimumFractionDigits: 1,
        }" />
      </UFormField>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { LowerThird } from '~/types/replicants';

const lowerThird = await useReplicant<LowerThird>("lowerThird");
const copyright = computed(() => lowerThird.value!.copyright);
</script>

<style>

</style>