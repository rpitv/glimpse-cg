<template>
  <div>
    <UCard class="rounded-none max-height">
      <template #header>
        <p class="text-2xl">
          Customization
        </p>
      </template>
      <div style="max-height: 75vh; overflow-y: auto; scrollbar-gutter: stable;">
        <slot />
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
</style>
