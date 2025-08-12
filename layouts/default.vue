<template>
  <div class="px-3">
    <UNavigationMenu class="w-full" :items="items">

    </UNavigationMenu>
    <slot />  
  </div>
</template>

<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'
const router = useRouter();



const items = ref<NavigationMenuItem[][]>([[
  {
    label: 'Setup',
    icon: 'i-heroicons-cog-20-solid',
    to: '/'
  },
  {
    label: 'Graphics',
    icon: 'i-heroicons-document-text-20-solid',
    to: '/graphics'
  },
  {
    label: 'Scoreboard',
    icon: 'i-heroicons-information-circle-20-solid',
    to: '/scoreboard'
  }
],
[
  {
    label: 'Channels',
    icon: 'i-heroicons-tv-20-solid',
    slot: 'channels' as const
  },
  {
    label: 'Preview',
    icon: 'i-heroicons-eye-20-solid',
    onSelect: () => {
      router.push({
        path: '/display',
        query: {
          dev: '1'
        }
      });
    }
  }
]]);

</script>

<style>

</style>