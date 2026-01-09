<template>
  <div class="px-3">
    <UNavigationMenu
      class="w-full"
      :items="items"

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
    icon: 'i-heroicons-information-circle-20-solid',
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
    icon: 'i-heroicons-eye-20-solid',
    to: '/display?dev=1',
    target: '_blank',
  },
]]);
</script>

<style>

</style>
