<template>
  <UCard class="rounded-none">
    <template #header>
      <b class="text-2xl">Clock Control</b>
    </template>
    <template #default>
      <p class="text-center text-5xl">
        {{ formattedClockTime }}
      </p>
      <USeparator class="mt-2" />
      <div class="mt-4 flex justify-center">
        <UTooltip
          text="Controls cannot be edited when sync is enabled."
          :disabled="!sync.clock"
        >
          <UFieldGroup>
            <UInput
              v-model="time"
              :disabled="sync.clock"
              placeholder="MM:SS.s"
              :ui="{ base: 'text-center w-24' }"
              @keydown.enter="setTime()"
            />
            <UButton
              :disabled="sync.clock"
              @click="setTime()"
            >
              Set Time
            </UButton>
          </UFieldGroup>
        </UTooltip>
      </div>
      <UTooltip
        text="Controls cannot be edited when sync is enabled."
        :disabled="!sync.clock"
      >
        <UFieldGroup
          class="mt-4 flex justify-center w-full"
          size="xl"
        >
          <UButton
            variant="outline"
            :disabled="sync.clock"
            @click="clock.time = Math.max(0, clock.time - 1000)"
          >
            <FontAwesomeIcon icon="fas fa-minus" />1s
          </UButton>
          <UButton
            variant="outline"
            :disabled="sync.clock"
            @click="clock.time = Math.max(0, clock.time - 100)"
          >
            <FontAwesomeIcon icon="fas fa-minus" />0.1s
          </UButton>
          <UButton
            variant="subtle"
            :disabled="clock.time === 0 || sync.clock"
            @click="clock.isRunning = !clock.isRunning"
          >
            <template v-if="clock.isRunning">
              <FontAwesomeIcon icon="fas fa-pause" /> Pause
            </template>
            <template v-else>
              <FontAwesomeIcon icon="fas fa-play" /> Start
            </template>
          </UButton>
          <UButton
            variant="outline"
            :disabled="sync.clock"
            @click="clock.time += 100"
          >
            <FontAwesomeIcon icon="fas fa-plus" />0.1s
          </UButton>
          <UButton
            variant="outline"
            :disabled="sync.clock"
            @click="clock.time += 1000"
          >
            <FontAwesomeIcon icon="fas fa-plus" />1s
          </UButton>
          <UButton
            variant="outline"
            color="secondary"
            :disabled="sync.clock"
            @click="clock.time = 120_000; clock.isRunning = false"
          >
            <FontAwesomeIcon icon="fas fa-rotate-right" />
            Reset
          </UButton>
        </UFieldGroup>
      </UTooltip>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { parseTimeString } from '~/utils/parseTimeString';

const toast = useToast();
const replicants = await useReplicants();
const scoreboard = replicants.scoreboard;
const sync = replicants.configuration.sync;

const clock = scoreboard.clock;
const time = ref('');

function setTime(timeString: string = time.value) {
  try {
    clock.time = parseTimeString(timeString);
  }
  catch (e) {
    toast.add({
      title: 'Error',
      description: (e as Error).message,
      color: 'error',
    });
    return;
  }
  clock.isRunning = false;
}

const formattedClockTime = computed<string>(() => {
  const minutes = Math.floor(clock.time / 60000).toString();
  let seconds = Math.floor((clock.time % 60000) / 1000).toString();
  const millis = Math.floor((clock.time % 1000) / 100).toString();
  if (minutes === '0') {
    return `${seconds}.${millis}`;
  }
  else {
    // noinspection TypeScriptUnresolvedFunction - Not sure why this is happening in my IDE
    seconds = seconds.padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
});
</script>

<style>

</style>
