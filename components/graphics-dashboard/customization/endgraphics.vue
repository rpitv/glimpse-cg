<template>
  <div>
    <UFormField help="To disable or not to disable the end graphics, that is the question.">
      <UCheckbox v-model="endGraphics.disabled" label="Something something edward put it in"></UCheckbox>
    </UFormField>
    <UFormField class="mt-4" label="Type" help="The type of end graphics to display.">
      <URadioGroup v-model="endGraphics.type" :items="[
        { label: 'Scroll', value: 'scroll' },
        { label: 'Box', value: 'box' }
      ]">
      </URadioGroup>
    </UFormField>
    <UFormField class="mt-4" label="Title" help="The title of the end graphics.">
      <UInput v-model="endGraphics.title" />
    </UFormField>
    <UFormField class="mt-4" label="Message" help="The message to display in the end graphics.">
      <UTextarea :rows="12" v-model="endGraphics.message" />
    </UFormField>
    <UFormField class="mt-4" label="Length" help="The length of the scroll in seconds.">
      <UInputNumber v-model="endGraphics.length" :step="0.5" :format-options="{
        minimumFractionDigits: 1,
      }" />
    </UFormField>
  </div>
</template>

<script lang="ts" setup>
import { UForm, UTextarea } from '#components';
import type { LowerThird } from '~/types/replicants';

const lowerThird = await useReplicant<LowerThird>("lowerThird");
const endGraphics = computed(() => lowerThird.value!.endGraphics);

</script>

<style>

</style>