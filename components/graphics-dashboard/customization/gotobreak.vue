<template>
  <div>
    <UFormField label="Offset X" help="Adjust the horizontal position of the Go To Break. Positive values move it to the right, negative values to the left.">
      <DebouncedInputNumber v-model="goToBreak.offsetX" :step="0.1" :format-options="{ minimumFractionDigits: 1 }" />
    </UFormField>
    <UFormField class="mt-4" label="Offset Y" help="Adjust the vertical position of the Go To Break. Positive values move it up, negative values down.">
      <DebouncedInputNumber v-model="goToBreak.offsetY" :step="0.1" :format-options="{ minimumFractionDigits: 1 }" />
    </UFormField>
    <UFormField class="mt-4" label="Show Clock" help="Toggle to show or hide the clock during the break screen.">
      <DebouncedSwitch v-model="goToBreak.description.clock" />
    </UFormField>
    <UFormField class="mt-4" label="Description Text" help="The text to display when going to break.">
      <DebouncedInput v-model="goToBreak.description.text" />
    </UFormField>
    <UPopover arrow>
      <UButton
        class="mt-2"
        label="Show Advanced Settings"
        variant="outline"
      />
      <template #content>
        <div class="p-2" style="box-shadow: 0 4px 16px rgba(0,0,0,0.9); border-radius: 0.5rem;">
          <UFormField class="mt-4" label="Description Font Color" help="The color of the description text.">
            <DebouncedInput v-model="goToBreak.description.fontColor" placeholder="Currently Default">
              <template #leading>
                <UPopover>
                  <span :style="`background-color: ${goToBreak.description.fontColor}`" class="size-5 rounded-full" />
                  <template #content>
                    <UColorPicker :throttle="500" v-model="goToBreak.description.fontColor" />
                  </template>
                </UPopover>
              </template>
            </DebouncedInput>
          </UFormField>
          <UFormField class="mt-4" label="Description Font Size" help="The size of the description text.">
            <DebouncedInputNumber v-model="goToBreak.description.fontSize" :step="0.1" :format-options="{ minimumFractionDigits: 1 }" />
          </UFormField>
        </div>
      </template>
    </UPopover>
    <UAccordion class="mt-4" :items="teams">
      <template #default="{ item }">
        <p>{{ item.name }}</p>
      </template>
      <template #content="{ item }">
        <USeparator />
        <UFormField class="mt-4" label="Team Name" help="The name of the team.">
          <DebouncedInput v-model="goToBreak[item.key].name" :placeholder="configuration![item.key].shortName"/>
        </UFormField>
        <UFormField class="mt-4" label="Team Name Color" help="The color for the team name.">
          <DebouncedInput v-model="goToBreak[item.key].nameColor" placeholder="Currently Default">
            <template #leading>
              <UPopover>
                <span :style="`background-color: ${goToBreak[item.key].nameColor}`" class="size-5 rounded-full" />
                <template #content>
                  <UColorPicker :throttle="500" v-model="goToBreak[item.key].nameColor" />
                </template>
              </UPopover>
            </template>
          </DebouncedInput>
        </UFormField>
        <UFormField class="mt-4" label="Team Name Size" help="Adjust the size of the team name.">
          <DebouncedInputNumber v-model="goToBreak[item.key].nameSize" :step="0.1" :format-options="{ minimumFractionDigits: 1 }" />
        </UFormField>
        <UFormField class="mt-4" label="Team Logo" help="The logo of the team.">
          <DebouncedInput class="w-full" v-model="goToBreak[item.key].logo" :placeholder="configuration![item.key].logo" />
        </UFormField>
      </template>
    </UAccordion>
  </div>
</template>

<script lang="ts" setup>
import type { Configuration, LowerThird } from '~/types/replicants';

const lowerThird = await useReplicant<LowerThird>("lowerThird");
const configuration = await useReplicant<Configuration>("configuration");
const goToBreak = computed(() => lowerThird.value!.goToBreak);
const teams: {
  name: string;
  key: 'homeTeam' | 'awayTeam';
}[] = [
  { name: 'Away Team', key: 'awayTeam' },
  { name: 'Home Team', key: 'homeTeam' }
];
</script>

<style>

</style>