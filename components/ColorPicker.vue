<template>
  <UFormField class="mt-4" :label :help>
    <UInput v-model="modelValue" :placeholder="placeholder ?? 'Currently Default'">
      <template #leading>
        <UPopover>
          <span :style="`background-color: ${modelValue}; border: 1px solid;`" class="size-5 rounded-full" />
          <template #content>
            <UColorPicker :throttle="500" v-model="modelValue" />
          </template>
        </UPopover>
      </template>
    </UInput>
  </UFormField>
</template>

<script lang="ts" setup>
const modelValue = defineModel<string>();

defineProps<{
  label: string;
  help: string;
  placeholder?: string;
}>();
</script>

<style>

</style>