<template>
  <div>
    <!-- <UFormField label="Offset X" help="Adjust the horizontal position of the Go To Break. Positive values move it to the right, negative values to the left.">
      <UInputNumber v-model="goToBreak.offsetX" :step="0.1" :format-options="{ minimumFractionDigits: 1 }" />
    </UFormField>
    <UFormField class="mt-4" label="Offset Y" help="Adjust the vertical position of the Go To Break. Positive values move it up, negative values down.">
      <UInputNumber v-model="goToBreak.offsetY" :step="0.1" :format-options="{ minimumFractionDigits: 1 }" />
    </UFormField> -->
    <div class="flex justify-between">
      <UFormField
        label="Show Clock"
        help="Toggle to show or hide the clock during the break screen."
      >
        <USwitch v-model="goToBreak.description.clock" />
      </UFormField>
      <UFormField
        label="Auto Fit"
        help="Automatically adjust the size of the text to fit within the box."
      >
        <USwitch v-model="goToBreak.description.autoFit" />
      </UFormField>
    </div>
    <UFormField
      class="mt-4"
      label="Description Text"
      help="The text to display when going to break."
    >
      <UCommandPalette
        :ui="{
          root: 'border border-muted border-solid w-[50%]',
        }"
        :groups="itemsTitle"
        :search-term="goToBreak.description.text"
        :close="goToBreak.description.text.length > 0"
        placeholder="Type in the description or click on one"
        @update:model-value="(val) => goToBreak.description.text = val?.label || ''"
        @update:search-term="(val: string) => goToBreak.description.text = val"
        @update:open="goToBreak.description.text = ''"
      />
    </UFormField>
    <UPopover arrow>
      <UButton
        class="mt-2"
        label="Show Advanced Settings"
        variant="outline"
      />
      <template #content>
        <div
          class="p-2"
          style="box-shadow: 0 4px 16px rgba(0,0,0,0.9); border-radius: 0.5rem;"
        >
          <ColorPicker
            v-model="goToBreak.description.fontColor"
            label="Description Text Color"
            help="The color for the description text."
          />
          <UFormField
            class="mt-4"
            label="Description Font Size"
            help="The size of the description text."
          >
            <UInputNumber
              v-model="goToBreak.description.fontSize"
              :step="0.1"
              :format-options="{ minimumFractionDigits: 1 }"
            />
          </UFormField>
        </div>
      </template>
    </UPopover>
    <div class="flex justify-around mt-2">
      <UCard class="w-full rounded-none">
        <template #header>
          <p class="text-2xl">
            Away Team
          </p>
        </template>
        <template #default>
          <UFormField
            class="mt-4"
            label="Team Name"
            help="The name of the away team."
          >
            <UInput
              v-model="goToBreak.awayTeam.name"
              :placeholder="configuration!.awayTeam.shortName"
            />
          </UFormField>
          <ColorPicker
            v-model="goToBreak.awayTeam.nameColor"
            class="mt-4"
            label="Name Color"
            help="The color for the away team name."
          />
          <UFormField
            class="mt-4"
            label="Name Size"
            help="Adjust the size of the away team name."
          >
            <UInputNumber
              v-model="goToBreak.awayTeam.nameSize"
              :step="0.1"
              :format-options="{ minimumFractionDigits: 1 }"
            />
          </UFormField>
          <UFormField
            class="mt-4"
            label="Logo"
            help="The logo of the team."
          >
            <UInput
              v-model="goToBreak.awayTeam.logo"
              class="w-full"
              :placeholder="configuration!.awayTeam.logo"
            />
          </UFormField>
          <div class="flex mt-4 gap-2">
            <ColorPicker
              v-model="goToBreak.awayTeam.primaryColor"
              :placeholder="replicants.configuration.awayTeam.primaryColor"
              label="Primary Color"
              help="The primary color for the away team."
            />
            <ColorPicker
              v-model="goToBreak.awayTeam.secondaryColor"
              :placeholder="replicants.configuration.awayTeam.secondaryColor"
              label="Secondary Color"
              help="The secondary color for the away team."
            />
          </div>
        </template>
      </UCard>
      <UCard class="w-full rounded-none">
        <template #header>
          <p class="text-2xl">
            Home Team
          </p>
        </template>
        <template #default>
          <UFormField
            class="mt-4"
            label="Team Name"
            help="The name of the home team."
          >
            <UInput
              v-model="goToBreak.homeTeam.name"
              :placeholder="configuration!.homeTeam.shortName"
            />
          </UFormField>
          <ColorPicker
            v-model="goToBreak.homeTeam.nameColor"
            class="mt-4"
            label="Team Name Color"
            help="The color for the home team name."
          />
          <UFormField
            class="mt-4"
            label="Team Name Size"
            help="Adjust the size of the home team name."
          >
            <UInputNumber
              v-model="goToBreak.homeTeam.nameSize"
              :step="0.1"
              :format-options="{ minimumFractionDigits: 1 }"
            />
          </UFormField>
          <UFormField
            class="mt-4"
            label="Team Logo"
            help="The logo of the team."
          >
            <UInput
              v-model="goToBreak.homeTeam.logo"
              class="w-full"
              :placeholder="configuration!.homeTeam.logo"
            />
          </UFormField>
          <div class="flex mt-4 gap-2">
            <ColorPicker
              v-model="goToBreak.homeTeam.primaryColor"
              :placeholder="replicants.configuration.homeTeam.primaryColor"
              label="Primary Color"
              help="The primary color for the home team."
            />
            <ColorPicker
              v-model="goToBreak.homeTeam.secondaryColor"
              :placeholder="replicants.configuration.homeTeam.secondaryColor"
              label="Secondary Color"
              help="The secondary color for the home team."
            />
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CommandPaletteGroup } from '@nuxt/ui';

const replicants = await useReplicants();
const configuration = replicants.configuration;
const goToBreak = replicants.lowerThird.goToBreak;

const itemsTitle = ref<CommandPaletteGroup[]>([
  {
    id: 'titles',
    label: 'Start/End of X',
    items: [],
  },
]);

if (replicants.configuration.style === 'football')
  itemsTitle.value[0]!.items = [
    {
      label: 'End of 1st Quarter',
      value: 'End of 1st Quarter',
    },
    {
      label: 'Halftime',
      value: 'Halftime',
    },
    {
      label: 'End of 3rd Quarter',
      value: 'End of 3rd Quarter',
    },
    {
      label: 'Final',
      value: 'Final',
    },
  ];
else
  itemsTitle.value[0]!.items = [
    { label: 'Start of 1st', value: 'Start of 1st' },
    { label: 'End of 1st', value: 'End of 1st' },
    { label: 'Start of 2nd', value: 'Start of 2nd' },
    { label: 'End of 2nd', value: 'End of 2nd' },
    { label: 'Start of 3rd', value: 'Start of 3rd' },
    { label: 'End of 3rd', value: 'End of 3rd' },
    { label: 'Final', value: 'Final' },
  ];
</script>

<style>

</style>
