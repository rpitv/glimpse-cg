<template>
  <div>
    <UApp>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>

<script lang="ts" setup>
const state = useState<string>('channel');

callOnce(async () => {
  state.value = 'default';
})

</script>


<style>
@import './assets/css/main.css';

</style>