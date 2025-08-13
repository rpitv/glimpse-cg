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
import type { Scoreboard, Channel, Configuration, LowerThird, External, Fullscreen } from './types/replicants';

const configuration = useState("configuration");
const channels = useState("channels");
const scoreboard = useState("scoreboard");
const lowerThird = useState("lowerThird");
const external = useState("external");
const fullscreen = useState("fullscreen");

callOnce(async () => {
  configuration.value = await useReplicant<Configuration>("configuration");
  channels.value = await useReplicant<Channel>("channels");
  scoreboard.value = await useReplicant<Scoreboard>("scoreboard");
  lowerThird.value = await useReplicant<LowerThird>("lowerThird");
  external.value = await useReplicant<External>("external");
  fullscreen.value = await useReplicant<Fullscreen>("fullscreen");
})
</script>

<style>
@import './assets/css/main.css';

</style>