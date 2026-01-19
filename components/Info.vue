<template>
  <UTooltip
    :delay-duration="600"
    :ui="{ text: 'whitespace-pre-line', content: 'h-auto bg-black text-sm' }"
    v-model:open="open"
  >
    <template #content>
      <slot />
    </template>
    <FontAwesomeIcon
      @click="open = true"
      icon="info-circle"
      style="color: var(--ui-color-info-400);"
    />
  </UTooltip>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const open = ref(false);
</script>

<style>

</style>
