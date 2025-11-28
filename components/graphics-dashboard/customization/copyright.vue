<template>
  <div>
    <UFormField
      label="Offset X"
      help="Adjust the horizontal position of the copyright. Positive values move it to the right, negative values to the left."
    >
      <UInputNumber
        v-model="copyright.offsetX"
        :step="0.1"
        :format-options="{
          minimumFractionDigits: 1,
        }"
      />
    </UFormField>
    <UFormField
      class="mt-4"
      label="Offset Y"
      help="Adjust the vertical position of the copyright. Positive values move it up, negative values down."
    >
      <UInputNumber
        v-model="copyright.offsetY"
        :step="0.1"
        :format-options="{
          minimumFractionDigits: 1,
        }"
      />
    </UFormField>
    <div class="mt-4">
      <UFormField
        label="Text"
        help="The text of the copyright."
      >
        <UInput
          v-model="copyright.text"
          placeholder="Currently Default"
        />
      </UFormField>
      <ColorPicker
        v-model="copyright.textColor"
        label="Text Color"
        help="The color for the copyright text."
      />
      <UFormField
        class="mt-4"
        label="Name Size"
        help="Adjust the size of the copyright text."
      >
        <UInputNumber
          v-model="copyright.textSize"
          :step="0.1"
          :format-options="{
            minimumFractionDigits: 1,
          }"
        />
      </UFormField>
    </div>
  </div>
</template>

<script lang="ts" setup>
const replicants = await useReplicants();
const copyright = replicants.lowerThird.copyright;
</script>

<style>

</style>
