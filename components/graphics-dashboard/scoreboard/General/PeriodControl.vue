<template>
  <UCard class="rounded-none">
    <template #header>
      <p class="text-2xl">Period Control</p>
    </template>
    <template #default>
      <p class="text-center text-2xl">{{ formattedPeriod }}</p>
      <div class="flex">
        <UButton class="mt-4 mr-2" variant="outline" :disabled="period.count <= 1" @click="decreasePeriod">
          <FontAwesomeIcon icon="fas fa-minus" /> 1
        </UButton>
        <USlider class="mt-4" v-model="period.count" :min="1" :max="period.length + period.overtime.length" :tooltip="true" :step="1" />
        <UButton class="mt-4 ml-2" variant="outline" @click="increasePeriod">
          <FontAwesomeIcon icon="fas fa-plus" /> 1
        </UButton>
      </div>
      <div class="flex gap-2 mt-4 justify-around w-full">
        <UFormField class="w-full" label="Total Periods" help="# of periods during regulation">
          <UInputNumber size="xl" class="w-full" v-model="period.length" :min="1" />
        </UFormField>
        <UFormField class="w-full" label="Overtime Length" help="# of overtimes after regulation">
          <UInputNumber size="xl" class="w-full" v-model="period.overtime.length" :min="0" />
        </UFormField>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

const replicants = await useReplicants();

const scoreboard = replicants.scoreboard;
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
    return "OT";
  return `OT${overtimeCount}`;
});


function increasePeriod() {
  // TODO: Add infinite overtime
  period.count += 1;
}

function decreasePeriod() {
  if (period.count > 1)
    period.count -= 1;
}
</script>

<style>

</style>