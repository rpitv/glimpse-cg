<template>
  <UCard class="rounded-none">
    <template #header>
      <b class="text-2xl">Period Control
        <Info>
          The period control has one extra tick intended for the <br>penultimate tiebreaker state (Ex: shootout) at all times.
        </Info>
      </b>
    </template>
    <template #default>
      <p class="text-center text-2xl">
        {{ formattedPeriod }}
      </p>
      <div class="flex">
        <UTooltip
          text="Controls cannot be edited when sync is enabled."
          :disabled="!sync.period"
        >
          <UButton
            class="mt-4 mr-2"
            variant="outline"
            :disabled="period.count <= 1 || sync.period"
            @click="decreasePeriod"
          >
            <FontAwesomeIcon icon="fas fa-minus" /> 1
          </UButton>
        </UTooltip>
        <UTooltip
          text="Controls cannot be edited when sync is enabled."
          :disabled="!sync.period"
        >
          <USlider
            v-model="period.count"
            :disabled="sync.period"
            class="mt-4"
            :min="1"
            :max="period.length + period.overtime.length + 1"
            :tooltip="true"
            :step="1"
          />
        </UTooltip>
        <UTooltip
          text="Controls cannot be edited when sync is enabled."
          :disabled="!sync.period"
        >
          <UButton
            class="mt-4 ml-2"
            variant="outline"
            :disabled="period.count >= period.length + period.overtime.length + 1 || sync.period"
            @click="increasePeriod"
          >
            <FontAwesomeIcon icon="fas fa-plus" />1
          </UButton>
        </UTooltip>
      </div>
      <div class="flex gap-2 mt-4 justify-around w-full">
        <UFormField
          class="w-full"
          label="Total Periods"
          help="# of periods during regulation"
        >
          <UInputNumber
            v-model="period.length"
            size="xl"
            class="w-full"
            :min="1"
          />
        </UFormField>
        <UFormField
          class="w-full"
          label="Overtime Length"
          help="# of overtimes after regulation"
        >
          <UInputNumber
            v-model="period.overtime.length"
            size="xl"
            class="w-full"
            :min="0"
          />
        </UFormField>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const replicants = await useReplicants();

const scoreboard = replicants.scoreboard;
const sync = replicants.configuration.sync;
const period = scoreboard.period;

const formattedPeriod = computed(() => {
  if (period.count <= period.length) {
    if (period.count === 1)
      return `${period.count}st`;
    if (period.count === 2)
      return `${period.count}nd`;
    if (period.count === 3)
      return `${period.count}rd`;
    return `${period.count}th`;
  }
  const overtimeCount = period.count - period.length;
  if (overtimeCount === 1 && period.overtime.length === 1)
    return 'OT';
  if (period.overtime.length + period.length < period.count)
    return 'S/O';
  return `OT${overtimeCount}`;
});

function increasePeriod() {
  // TODO: Add infinite overtime
  if (period.length + period.overtime.length + 1 > period.count)
    period.count += 1;
}

function decreasePeriod() {
  if (period.count > 1)
    period.count -= 1;
}
</script>

<style>

</style>
