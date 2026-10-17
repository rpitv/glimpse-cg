<template>
  <UCard class="w-full h-full rounded-none max-height shadow-none inset-shadow-none ring-0 inset-ring-0">
    <template #header>
      <p class="text-2xl">
        Customization
      </p>
    </template>
    <div style="max-height: 75vh; overflow-y: auto; scrollbar-gutter: stable;">
      <slot />
    </div>
  </UCard>
</template>

<script lang="ts" setup>

</script>

<style scoped>
</style>
