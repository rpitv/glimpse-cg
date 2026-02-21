<template>
  <UCard>
    <template #header>
      <h2> {{ teamSide === 'awayTeam' ? 'Away Team' : 'Home Team' }}</h2>
    </template>
    <UFormField label="Preset Schools">
      <USelectMenu
        v-model="selectedSchool"
        class="input-menu"
        :items="schools as Configuration['awayTeam' | 'homeTeam'][]"
        label-key="schoolName"
      />
      <UButton
        class="mt-2"
        @click="() => { if (selectedSchool) $emit('loadPreset', teamSide, selectedSchool as Configuration['awayTeam' | 'homeTeam']) }"
      >
        Load Preset
      </UButton>
    </UFormField>
    <br>
    <UCollapsible>
      <UButton
        class="w-full group"
        variant="ghost"
        trailing-icon="i-lucide-chevron-down"
        :ui="{
          trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
        }"
      >
        Advanced Settings
      </UButton>
      <template #content>
        <div class="grid grid-cols-2 gap-x-4 gap-y-2">
          <UFormField label="Short Name (14 Characters Max)">
            <UInput
              v-model="configuration[props.teamSide].shortName"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Abbreviation (2-5 Characters)">
            <UInput
              v-model="configuration[props.teamSide].abbr"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Team Name">
            <UInput
              v-model="configuration[props.teamSide].teamName"
              class="w-full"
            />
          </UFormField>
          <UFormField label="School Name">
            <UInput
              v-model="configuration[props.teamSide].schoolName"
              class="w-full"
            />
          </UFormField>
        </div>
        <div class="mt-2">
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Primary Color">
              <UInput
                v-model="configuration[props.teamSide].primaryColor"
                class="w-full"
              >
                <template #leading>
                  <UPopover>
                    <span
                      :style="primaryChip"
                      class="size-5 rounded-full"
                    />
                    <template #content>
                      <UColorPicker
                        v-model="configuration[props.teamSide].primaryColor"
                        :throttle="500"
                      />
                    </template>
                  </UPopover>
                </template>
              </UInput>
            </UFormField>
            <UFormField label="Secondary Color">
              <UInput
                v-model="configuration[props.teamSide].secondaryColor"
                class="w-full"
              >
                <template #leading>
                  <UPopover>
                    <span
                      :style="secondaryChip"
                      class="size-5 rounded-full"
                    />
                    <template #content>
                      <UColorPicker
                        v-model="configuration[props.teamSide].secondaryColor"
                        :throttle="500"
                      />
                    </template>
                  </UPopover>
                </template>
              </UInput>
            </UFormField>
          </div>
          <UFormField
            class="mt-2"
            label="Team Logo"
          >
            <UInput
              v-model="configuration[props.teamSide].logo"
              class="w-full"
            />
          </UFormField>
          <div v-if="configuration[props.teamSide].logo">
            <img
              :src="configuration[props.teamSide].logo"
              alt="Team Logo"
              class="h-32 object-cover rounded-lg mt-2"
              style="border: 1px solid var(--u-color-border);"
            >
          </div>
          <UFormField label="Athletics URL">
            <UInput
              v-model="configuration[props.teamSide].athletics"
              class="w-full"
            />
          </UFormField>
        </div>
      </template>
    </UCollapsible>
  </UCard>
</template>

<script lang="ts" setup>
import type { Configuration } from '~/types/replicants';
import schools from '~/assets/schools.json';

const toast = useToast();
const replicants = await useReplicants();
const configuration = replicants.configuration;
const props = defineProps({
  teamSide: {
    type: String as PropType<'awayTeam' | 'homeTeam'>,
    required: true,
  },
});

const selectedSchool = ref<Configuration['awayTeam' | 'homeTeam']>();
const primaryChip = computed(() => ({ backgroundColor: configuration[props.teamSide].primaryColor }));
const secondaryChip = computed(() => ({ backgroundColor: configuration[props.teamSide].secondaryColor }));

defineEmits(['loadPreset']);
</script>

<style>
.input-menu {
  width: 100%;
}
</style>
