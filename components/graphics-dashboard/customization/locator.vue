<template>
  <div>
    <!-- <UFormField label="Offset X" help="Adjust the horizontal position of the locator. Positive values move it to the right, negative values to the left.">
      <UInputNumber v-model="locator.offsetX" :step="0.1" :format-options="{
        minimumFractionDigits: 1,
      }" />
    </UFormField>
    <UFormField class="mt-4" label="Offset Y" help="Adjust the vertical position of the locator. Positive values move it up, negative values down.">
      <UInputNumber v-model="locator.offsetY" :step="0.1" :format-options="{
        minimumFractionDigits: 1,
      }" />
    </UFormField> -->
    <!-- <UFormField
      class="mt-4"
      label="Location"
      help="The location of the event."
    >
      <UInput
        v-model="locator.location.name"
        placeholder="Default Value"
      />
    </UFormField> -->
    <!-- <UPopover arrow>
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
            v-model="locator.location.nameColor"
            label="Location Text Color"
            help="The color for the location text."
          />
          <UFormField
            class="mt-4"
            label="Location Text Size"
            help="Adjust the size of the location text."
          >
            <UInputNumber
              v-model="locator.location.nameSize"
              :step="0.1"
              :format-options="{ minimumFractionDigits: 1 }"
            />
          </UFormField>
        </div>
      </template>
    </UPopover> -->
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
              v-model="locator.awayTeam.name"
              :placeholder="configuration!.awayTeam.shortName"
            />
          </UFormField>
          <ColorPicker
            v-model="locator.awayTeam.nameColor"
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
              v-model="locator.awayTeam.nameSize"
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
              v-model="locator.awayTeam.logo"
              class="w-full"
              :placeholder="configuration!.awayTeam.logo"
            />
          </UFormField>
          <div class="flex mt-4 gap-2">
            <ColorPicker
              v-model="locator.awayTeam.primaryColor"
              :placeholder="replicants.configuration.awayTeam.primaryColor"
              label="Primary Color"
              help="The primary color for the away team."
            />
            <ColorPicker
              v-model="locator.awayTeam.secondaryColor"
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
              v-model="locator.homeTeam.name"
              :placeholder="configuration!.homeTeam.shortName"
            />
          </UFormField>
          <ColorPicker
            v-model="locator.homeTeam.nameColor"
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
              v-model="locator.homeTeam.nameSize"
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
              v-model="locator.homeTeam.logo"
              class="w-full"
              :placeholder="configuration!.homeTeam.logo"
            />
          </UFormField>
          <div class="flex mt-4 gap-2">
            <ColorPicker
              v-model="locator.homeTeam.primaryColor"
              :placeholder="replicants.configuration.homeTeam.primaryColor"
              label="Primary Color"
              help="The primary color for the home team."
            />
            <ColorPicker
              v-model="locator.homeTeam.secondaryColor"
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
const replicants = await useReplicants();
const configuration = replicants.configuration;
const locator = replicants.lowerThird.locator;

const teams: {
  name: string;
  key: 'homeTeam' | 'awayTeam';
}[] = [
  { name: 'Away Team', key: 'awayTeam' },
  { name: 'Home Team', key: 'homeTeam' },
];
</script>

<style>

</style>
