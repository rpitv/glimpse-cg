<template>
  <UInputNumber v-model="localValue" v-bind="$attrs" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounce } from '@vueuse/core'

const props = defineProps<{
  modelValue: number
  debounce?: number
}>()
const emit = defineEmits(['update:modelValue'])

const localValue = ref(props.modelValue)
const debounced = useDebounce(localValue, props.debounce ?? 200)

watch(() => props.modelValue, (val) => {
  if (val !== localValue.value) localValue.value = val
})

watch(debounced, (val) => {
  emit('update:modelValue', val)
})
</script>
