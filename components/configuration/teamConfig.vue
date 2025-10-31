<template>
  <UCard>
    <template #header>
      <h2> {{ teamSide === 'awayTeam' ? 'Away Team' : 'Home Team' }}</h2>
    </template>
    <UFormField label="Preset Schools">
      <USelectMenu v-model="selectedSchool" class="input-menu" :items="schools as Configuration['awayTeam' | 'homeTeam'][]" label-key="schoolName" />
      <UButton class="mt-2" @click="() => { if (selectedSchool) $emit('loadPreset', teamSide, selectedSchool as Configuration['awayTeam' | 'homeTeam']) }">
        Load Preset
      </UButton>
    </UFormField>
    <br></br>
    <UCollapsible>
      <UButton class="w-full group" variant="ghost" trailing-icon="i-lucide-chevron-down"
        :ui="{
          trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
        }">Advanced Settings
      </UButton>
      <template #content>
        <div class="grid grid-cols-2 gap-x-4 gap-y-2">
          <UFormField label="Short Name (14 Characters Max)">
            <UInput class="w-full" v-model="configuration[props.teamSide].shortName" />
          </UFormField>
          <UFormField label="Abbreviation (2-5 Characters)">
            <UInput class="w-full" v-model="configuration[props.teamSide].abbr" />
          </UFormField>
          <UFormField label="Team Name">
            <UInput class="w-full" v-model="configuration[props.teamSide].teamName" />
          </UFormField>
          <UFormField label="School Name">
            <UInput class="w-full" v-model="configuration[props.teamSide].schoolName" />
          </UFormField>
        </div>
        <div class="mt-2">
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Primary Color">
              <UInput class="w-full" v-model="configuration[props.teamSide].primaryColor">
                <template #leading>
                  <UPopover>
                    <span :style="primaryChip" class="size-5 rounded-full" />
                    <template #content>
                      <UColorPicker :throttle="500" v-model="configuration[props.teamSide].primaryColor" />
                    </template>
                  </UPopover>
                </template>
              </UInput>
            </UFormField>
            <UFormField label="Secondary Color">
              <UInput class="w-full" v-model="configuration[props.teamSide].secondaryColor">
                <template #leading>
                  <UPopover>
                    <span :style="secondaryChip" class="size-5 rounded-full" />
                    <template #content>
                      <UColorPicker :throttle="500" v-model="configuration[props.teamSide].secondaryColor" />
                    </template>
                  </UPopover>
                </template>
              </UInput>
            </UFormField>
          </div>
          <UFormField class="mt-2" label="Team Logo">
            <UInput class="w-full" v-model="configuration[props.teamSide].logo" />
          </UFormField>
          <div v-if="configuration[props.teamSide].logo">
            <img
              :src="configuration[props.teamSide].logo"
              alt="Team Logo"
              class="h-32 object-cover rounded-lg mt-2"
              style="border: 1px solid var(--u-color-border);"
            >
            </img>
          </div>
          <UFormField label="Athletics URL">
            <UInput class="w-full" v-model="configuration[props.teamSide].athletics" />
          </UFormField>
        </div>
      </template>
    </UCollapsible>
  </UCard>
</template>

<script lang="ts" setup>
import type { Configuration } from '~/types/replicants';
import schools from "~/assets/schools.json";

const toast = useToast();
const replicants = await useReplicants();
const configuration = replicants.configuration;
const props = defineProps({
  teamSide: {
    type: String as PropType<'awayTeam' | 'homeTeam'>,
    required: true
  }
});

const selectedSchool = ref<Configuration['awayTeam' | 'homeTeam']>();
const primaryChip = computed(() => ({ backgroundColor: configuration[props.teamSide].primaryColor }));
const secondaryChip = computed(() => ({ backgroundColor: configuration[props.teamSide].secondaryColor }));

function loadPreset(school: Configuration['awayTeam' | 'homeTeam']) {
  // configuration[props.teamSide] = { ...school };
  configuration[props.teamSide].schoolName = school.schoolName;
  configuration[props.teamSide].shortName = school.shortName;
  configuration[props.teamSide].abbr = school.abbr;
  configuration[props.teamSide].teamName = school.teamName;
  configuration[props.teamSide].primaryColor = school.primaryColor;
  configuration[props.teamSide].secondaryColor = school.secondaryColor;
  configuration[props.teamSide].logo = school.logo;
  configuration[props.teamSide].athletics = school.athletics || '';
  toast.add({
    title: 'Preset Loaded',
    description: `Loaded preset for ${school.schoolName}`,
    duration: 3000
  });
}

defineEmits(['loadPreset']);

</script>

<style>
.input-menu {
  width: 100%;
}
</style>