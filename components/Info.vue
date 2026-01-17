<template>
  <UTooltip :delay-duration="600" :ui="{ text: 'whitespace-pre-line', content: 'h-auto' }">
    <template #content>
      <slot />
    </template>
    <FontAwesomeIcon icon="info-circle" style="color: var(--ui-color-info-400);" />
  </UTooltip>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

</script>

<style>

</style>