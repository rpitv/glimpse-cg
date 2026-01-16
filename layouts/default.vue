<template>
  <div class="px-3">
    <UNavigationMenu
      class="w-full"
      :items="items"
      @click.capture="blurActive"
    />
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui';

const items = ref<NavigationMenuItem[][]>([[
  {
    label: 'Setup',
    icon: 'i-heroicons-cog-20-solid',
    to: '/',
  },
  {
    label: 'Graphics',
    icon: 'i-heroicons-document-text-20-solid',
    to: '/graphics',
  },
  {
    label: 'Scoreboard',
    icon: 'i-heroicons-window-20-solid',
    to: '/scoreboard',
  },
  {
    label: 'Sync',
    icon: 'i-heroicons-arrow-path-20-solid',
    to: '/sync',
  },
],
[
  {
    label: 'Preview',
    icon: 'i-heroicons-tv-20-solid',
    to: '/display?dev=1',
    target: '_blank',
  },
]]);

function blurActive() {
  const el = document.activeElement as HTMLElement | null;
  if (el && typeof el.blur === 'function') el.blur();
}
</script>

<style>

</style>
