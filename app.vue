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
import type { Channels, Configuration, Fullscreen, LowerThird, Scoreboard, External } from './types/replicants';


useReplicant<Configuration>('configuration');
useReplicant<LowerThird>('lowerThird');
useReplicant<Fullscreen>('fullscreen');
useReplicant<External>('external');
useReplicant<Channels>('channels');
useReplicant<Scoreboard>('scoreboard');

</script>

<style>
@import './assets/css/main.css';

</style>