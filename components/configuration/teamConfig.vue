<template>
  <UCard>
    <template #header>
      <h2> {{ teamSide === 'away' ? 'Away Team' : 'Home Team' }}</h2>
    </template>
    <UFormField label="Preset Schools">
      <USelectMenu v-model="selectedSchool" class="input-menu" :items="schools as Configuration['awayTeam' | 'homeTeam'][]" label-key="schoolName" />
      <UButton class="mt-2" @click="loadPreset(selectedSchool as Configuration['awayTeam' | 'homeTeam'])">
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
            <UInput class="w-full" v-model="props.modelValue.shortName" />
          </UFormField>
          <UFormField label="Abbreviation (2-5 Characters)">
            <UInput class="w-full" v-model="props.modelValue.abbr" />
          </UFormField>
          <UFormField label="Team Name">
            <UInput class="w-full" v-model="props.modelValue.teamName" />
          </UFormField>
          <UFormField label="School Name">
            <UInput class="w-full" v-model="props.modelValue.schoolName" />
          </UFormField>
        </div>
        <div class="mt-2">
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Primary Color">
              <UInput class="w-full" v-model="props.modelValue.primaryColor">
                <template #leading>
                  <UPopover>
                    <span :style="primaryChip" class="size-5 rounded-full" />
                    <template #content>
                      <UColorPicker :throttle="500" v-model="props.modelValue.primaryColor" />
                    </template>
                  </UPopover>
                </template>
              </UInput>
            </UFormField>
            <UFormField label="Secondary Color">
              <UInput class="w-full" v-model="props.modelValue.secondaryColor">
                <template #leading>
                  <UPopover>
                    <span :style="secondaryChip" class="size-5 rounded-full" />
                    <template #content>
                      <UColorPicker :throttle="500" v-model="props.modelValue.secondaryColor" />
                    </template>
                  </UPopover>
                </template>
              </UInput>
            </UFormField>
          </div>
          <UFormField class="mt-2" label="Team Logo">
            <UInput class="w-full" v-model="props.modelValue.logo" />
          </UFormField>
          <div v-if="props.modelValue.logo">
            <img
              :src="props.modelValue.logo"
              alt="Team Logo"
              class="h-32 object-cover rounded-lg mt-2"
              style="border: 1px solid var(--u-color-border);"
            >
            </img>
          </div>
          <UFormField label="Athletics URL">
            <UInput class="w-full" v-model="props.modelValue.athletics" />
          </UFormField>
          <UFormField class="mt-2" label="Special (CHECK THIS BOX IF ITS BROWN)">
            <UCheckbox v-model="props.modelValue.special" />
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

const props = defineProps({
  modelValue: {
    type: Object as PropType<Configuration['awayTeam' | 'homeTeam']>,
    required: true
  },
  teamSide: {
    type: String as PropType<'away' | 'home'>,
    required: true
  }
});

const selectedSchool = ref<Configuration['awayTeam' | 'homeTeam']>();
const primaryChip = computed(() => ({ backgroundColor: props.modelValue.primaryColor }))
const secondaryChip = computed(() => ({ backgroundColor: props.modelValue.secondaryColor }))


const emit = defineEmits(['update:modelValue']);

function loadPreset(school: Configuration['awayTeam' | 'homeTeam']) {
  props.modelValue.schoolName = school.schoolName;
  props.modelValue.shortName = school.shortName;
  props.modelValue.abbr = school.abbr;
  props.modelValue.teamName = school.teamName;
  props.modelValue.primaryColor = school.primaryColor;
  props.modelValue.secondaryColor = school.secondaryColor;
  props.modelValue.logo = school.logo;
  props.modelValue.athletics = school.athletics || '';
  props.modelValue.special = school.special || false;
  toast.add({
    title: 'Preset Loaded',
    description: `Loaded preset for ${school.schoolName}`,
    duration: 3000
  })
  emit('update:modelValue', props.modelValue);
}

defineExpose({
  loadPreset
});

</script>

<style>
.input-menu {
  width: 100%;
}
</style>