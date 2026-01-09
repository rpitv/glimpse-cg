<template>
  <div>
    <UApp
      :tooltip="{
        delayDuration: 100,
      }"
    >
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>

<script lang="ts" setup>
</script>

<style>
@import './assets/css/main.css';
</style>
