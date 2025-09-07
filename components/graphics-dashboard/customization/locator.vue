<template>
  <div>
     <UFormField label="Offset X" help="Adjust the horizontal position of the locator. Positive values move it to the right, negative values to the left.">
  <DebouncedInputNumber v-model="locator.offsetX" :step="0.1" :format-options="{
        minimumFractionDigits: 1,
      }" />
    </UFormField>
    <UFormField class="mt-4" label="Offset Y" help="Adjust the vertical position of the locator. Positive values move it up, negative values down.">
  <DebouncedInputNumber v-model="locator.offsetY" :step="0.1" :format-options="{
        minimumFractionDigits: 1,
      }" />
    </UFormField>
    <UFormField class="mt-4" label="Location" help="The location of the event.">
      <DebouncedInput v-model="locator.location.name" placeholder="Default Value" />
    </UFormField>
    <UPopover arrow>
      <UButton
        class="mt-2"
        label="Show Advanced Settings"
        variant="outline"
      />
      <template #content>
        <div class="p-2" style="box-shadow: 0 4px 16px rgba(0,0,0,0.9); border-radius: 0.5rem;">
          <UFormField class="mt-4" label="Location Text Color" help="The text color of the location team.">
            <DebouncedInput v-model="locator.location.nameColor" placeholder="Default Value">
              <template #leading>
                <UPopover>
                  <span :style="`background-color: ${locator.location.nameColor}`" class="size-5 rounded-full" />
                  <template #content>
                    <UColorPicker :throttle="500" v-model="locator.location.nameColor" />
                  </template>
                </UPopover>
              </template>
            </DebouncedInput>
          </UFormField>
          <UFormField class="mt-4" label="Location Text Size" help="Adjust the size of the location text.">
            <DebouncedInputNumber v-model="locator.location.nameSize" :step="0.1" :format-options="{ minimumFractionDigits: 1 }" />
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
          <DebouncedInput v-model="locator[item.key].name" :placeholder="configuration![item.key].shortName"/>
        </UFormField>
        <UFormField class="mt-4" label="Team Name Color" help="The color for the team name.">
          <DebouncedInput v-model="locator[item.key].nameColor" placeholder="Currently Default">
            <template #leading>
              <UPopover>
                <span :style="`background-color: ${locator[item.key].nameColor}`" class="size-5 rounded-full" />
                <template #content>
                  <UColorPicker :throttle="500" v-model="locator[item.key].nameColor" />
                </template>
              </UPopover>
            </template>
          </DebouncedInput>
        </UFormField>
        <UFormField class="mt-4" label="Team Name Size" help="Adjust the size of the team name.">
          <DebouncedInputNumber v-model="locator[item.key].nameSize" :step="0.1" :format-options="{
            minimumFractionDigits: 1,
          }" />
        </UFormField>
        <UFormField class="mt-4" label="Team Logo" help="The logo of the team.">  
          <DebouncedInput class="w-full" v-model="locator[item.key].logo" :placeholder="configuration![item.key].logo" />
        </UFormField>
      </template>
    </UAccordion>
  </div>
</template>

<script lang="ts" setup>
import type { Configuration, LowerThird } from '~/types/replicants';

const lowerThird = await useReplicant<LowerThird>("lowerThird");
const configuration = await useReplicant<Configuration>("configuration");
const locator = computed(() => lowerThird.value!.locator);
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