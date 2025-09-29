<template>
  <UCard class="rounded-none">
    <template #header>
      <p class="text-2xl">Clock Control</p>
    </template>
    <template #default>
      <p class="text-center text-5xl">{{ formattedClockTime }}</p>
      <USeparator class="mt-2" />
      <div class="mt-4 flex justify-center">
        <UFieldGroup>
          <UInput
            type="number"
            v-model="minutes"
            @update:model-value="checkMinutes"
            label="Minutes" 
            :ui="{ base: 'text-center w-16' }"
          />
          <span class="mx-2 text-xl">:</span>
          <UInput
            type="number"
            v-model="seconds"
            @update:model-value="checkSeconds"
            label="Seconds" 
            :ui="{ base: 'text-center w-16' }"
          />
          <UButton @click="setTime">Set Time</UButton>
        </UFieldGroup>
      </div>
      <UFieldGroup class="mt-4 flex justify-center w-full" size="xl">
        <UButton variant="outline" @click="clock.time = Math.max(0, clock.time - 1000)">
          <FontAwesomeIcon icon="fas fa-minus" />1s
        </UButton>
        <UButton variant="outline" @click="clock.time = Math.max(0, clock.time - 100)">
          <FontAwesomeIcon icon="fas fa-minus" />0.1s
        </UButton>
        <UButton variant="subtle" @click="clock.isRunning = !clock.isRunning" :disabled="clock.time === 0">
          <template v-if="clock.isRunning">
            <FontAwesomeIcon icon="fas fa-pause" /> Pause
          </template>
          <template v-else>
            <FontAwesomeIcon icon="fas fa-play" /> Start
          </template>
        </UButton>
        <UButton variant="outline" @click="clock.time += 100">
          <FontAwesomeIcon icon="fas fa-plus" />0.1s
        </UButton>
        <UButton variant="outline" @click="clock.time += 1000">
          <FontAwesomeIcon icon="fas fa-plus" />1s
        </UButton>
        <UButton variant="outline" color="secondary" @click="clock.time = 120_000; clock.isRunning = false">
          <FontAwesomeIcon icon="fas fa-rotate-right" />
          Reset
        </UButton>
      </UFieldGroup>
    </template>
  </UCard>
</template>

<script lang="ts" setup>

const replicants = await useReplicants();
const scoreboard = replicants.scoreboard;

const clock = scoreboard.clock;

const minutes = ref(0);
const seconds = ref(0);

function checkMinutes() {
  if (minutes.value < 0) minutes.value = 0;
  if (minutes.value > 99) minutes.value = 99;
}

function checkSeconds() {
  if (seconds.value < 0) seconds.value = 0;
  if (seconds.value > 59) seconds.value = 59;
}

function setTime() {
  clock.time = (minutes.value * 60 + seconds.value) * 1000;
  clock.isRunning = false;
}

const formattedClockTime = computed<string>(() => {
	const minutes = Math.floor(clock.time / 60000).toString();
	let seconds = Math.floor((clock.time % 60000) / 1000).toString();
	const millis = Math.floor((clock.time % 1000) / 100).toString();
	if (minutes === '0') {
		return `${seconds}.${millis}`;
	} else {
		// noinspection TypeScriptUnresolvedFunction - Not sure why this is happening in my IDE
		seconds = seconds.padStart(2, '0');
		return `${minutes}:${seconds}`;
	}
});

</script>

<style>

</style>