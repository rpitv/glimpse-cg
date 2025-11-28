<template>
  <div>
    <!-- <UFormField label="Offset X" help="Adjust the horizontal position of the Go To Break. Positive values move it to the right, negative values to the left.">
      <UInputNumber v-model="goToBreak.offsetX" :step="0.1" :format-options="{ minimumFractionDigits: 1 }" />
    </UFormField>
    <UFormField class="mt-4" label="Offset Y" help="Adjust the vertical position of the Go To Break. Positive values move it up, negative values down.">
      <UInputNumber v-model="goToBreak.offsetY" :step="0.1" :format-options="{ minimumFractionDigits: 1 }" />
    </UFormField> -->
    <UFormField
      class="mt-4"
      label="Show Clock"
      help="Toggle to show or hide the clock during the break screen."
    >
      <USwitch v-model="goToBreak.description.clock" />
    </UFormField>
    <UFormField
      class="mt-4"
      label="Description Text"
      help="The text to display when going to break."
    >
      <UInput v-model="goToBreak.description.text" />
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
    <!-- <UAccordion class="mt-4" :items="teams">
      <template #default="{ item }">
        <p>{{ item.name }}</p>
      </template>
      <template #content="{ item }">
        <USeparator />
        <UFormField class="mt-4" label="Team Name" help="The name of the team.">
          <UInput v-model="goToBreak[item.key].name" :placeholder="configuration![item.key].shortName"/>
        </UFormField>
        <ColorPicker class="mt-4" v-model="goToBreak[item.key].nameColor" label="Team Name Color" help="The color for the team name." />
        <UFormField class="mt-4" label="Team Name Size" help="Adjust the size of the team name.">
          <UInputNumber v-model="goToBreak[item.key].nameSize" :step="0.1" :format-options="{ minimumFractionDigits: 1 }" />
        </UFormField>
        <UFormField class="mt-4" label="Team Logo" help="The logo of the team.">
          <UInput class="w-full" v-model="goToBreak[item.key].logo" :placeholder="configuration![item.key].logo" />
        </UFormField>
      </template>
    </UAccordion> -->
  </div>
</template>

<script lang="ts" setup>
const replicants = await useReplicants();
const configuration = replicants.configuration;
const goToBreak = replicants.lowerThird.goToBreak;
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
