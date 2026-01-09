<template>
  <div>
    <UCard class="shadow-none inset-shadow-none ring-0 inset-ring-0 rounded-none border-1 border-(--tw-ring-color)">
      <template #header>
        <p class="text-2xl">
          Graphics List
        </p>
      </template>
      <template #default>
        <div>
          <URadioGroup
            :items="computedGraphics"
            value-key="val"
            indicator="hidden"
            variant="table"
            :ui="{
              item: [
                'has-data-[state=checked]:bg-transparent has-data-[state=checked]:border-muted has-data-[state=checked]:z-0',
                'has-[[role=radio][data-state=checked]]:bg-primary/10',
                'has-[[role=radio][data-state=checked]]:border-primary/50',
                'has-[[role=radio][data-state=checked]]:z-[1]',
              ].join(' '),
            }"
            @update:model-value="changeGraphic"
          >
            <template #label="{ item }">
              <div class="text-left">
                <div class="flex justify-between">
                  <p class="text-xl">
                    {{ item.label }}
                  </p>
                  <div class="flex gap-4 items-center">
                    <UKbd 
                      v-if="!inputFocus.isInputFocused.value && item.kbd"
                    >
                      {{ item.kbd }}
                    </UKbd>
                    <USwitch
                      v-if="item.label !== 'Custom Graphics'"
                      v-model="(channels[0]![item.val.reference as keyof Channel] as boolean)"
                      size="xl"
                      :debounce="75"
                    />
                  </div>
                </div>
              </div>
            </template>
          </URadioGroup>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Channel } from '~/types/replicants';
import { useGraphicsStore } from '~/store/graphics';
import Scorebug from './customization/scorebug.vue';
import Bug from './customization/bug.vue';
import Commentators from './customization/commentators.vue';
import Copyright from './customization/copyright.vue';
import GoToBreak from './customization/gotobreak.vue';
import Locator from './customization/locator.vue';
import PlayerBio from './customization/playerbio.vue';
import Standings from './customization/standings.vue';
import Credits from './customization/credits.vue';
import CustomGraphics from './customization/customgraphics.vue';
import type { Component } from 'vue';

const replicants = await useReplicants();
const inputFocus = useInputFocus();
const channels = replicants.channels;
const configuration = replicants.configuration;
const graphicsStore = useGraphicsStore();

interface Graphic {
  label: string;
  val: {
    name: string;
    component: any;
    reference: string;
  };
  restrictions: string[];
  kbd?: string;
}

defineShortcuts({
  ' ': () => {
    if (!inputFocus.isInputFocused.value) channels[0]!.scoreboard = !channels[0]?.scoreboard;
  },
  '1': () => {
    if (!inputFocus.isInputFocused.value) channels[0]!.bug = !channels[0]?.bug;
  },
  '2': () => {
    if (!inputFocus.isInputFocused.value) channels[0]!.commentators = !channels[0]?.commentators;
  },
  '3': () => {
    if (!inputFocus.isInputFocused.value) channels[0]!.copyright = !channels[0]?.copyright;
  },
  '4': () => {
    if (!inputFocus.isInputFocused.value) channels[0]!.credits = !channels[0]?.credits;
  },
  '5': () => {
    if (!inputFocus.isInputFocused.value) channels[0]!.goToBreak = !channels[0]?.goToBreak;
  },
  '6': () => {
    if (!inputFocus.isInputFocused.value) channels[0]!.locator = !channels[0]?.locator;
  },
  '7': () => {
    if (!inputFocus.isInputFocused.value) channels[0]!.playerBio = !channels[0]?.playerBio;
  },
  '8': () => {
    if (!inputFocus.isInputFocused.value) channels[0]!.standings = !channels[0]?.standings;
  }
});


const graphics: Graphic[] = [
  {
    label: 'Scorebug',
    val: { name: '', component: markRaw(Scorebug), reference: 'scoreboard' },
    restrictions: [],
    kbd: 'SPACE',
  },
  {
    label: 'Bug',
    val: { name: 'bug', component: markRaw(Bug), reference: 'bug' },
    restrictions: [],
    kbd: '1',
  },
  {
    label: 'Commentators',
    val: { name: 'commentators', component: markRaw(Commentators), reference: 'commentators' },
    restrictions: [],
    kbd: '2',
  },
  {
    label: 'Copyright',
    val: { name: 'copyright', component: markRaw(Copyright), reference: 'copyright' },
    restrictions: [],
    kbd: '3',
  },
  {
    label: 'Credits',
    val: { name: 'credits', component: markRaw(Credits), reference: 'credits' },
    restrictions: [],
    kbd: '4',
  },
  {
    label: 'Go To Break',
    val: { name: 'gotobreak', component: markRaw(GoToBreak), reference: 'goToBreak' },
    restrictions: [],
    kbd: '5',
  },
  {
    label: 'Locator',
    val: { name: 'locator', component: markRaw(Locator), reference: 'locator' },
    restrictions: [],
    kbd: '6',
  },
  {
    label: 'Player Bios',
    val: { name: 'playerbio', component: markRaw(PlayerBio), reference: 'playerBio' },
    restrictions: [],
    kbd: '7',
  },
  {
    label: 'Standings',
    val: { name: 'standings', component: markRaw(Standings), reference: 'standings' },
    restrictions: [],
    kbd: '8',
  },
  {
    label: 'Custom Graphics',
    val: { name: 'customgraphics', component: markRaw(CustomGraphics), reference: 'customGraphics' },
    restrictions: [],
  },
];

function changeGraphic(graphicVal: { name: string; component: Component; reference: string }) {
  graphicsStore.setGraphic({ component: graphicVal.component, name: graphicVal.name, index: -1 });
}

const computedGraphics = computed(() => {
  return graphics.filter((graphic) => {
    if (graphic.restrictions.length === 0) return true;
    return graphic.restrictions.includes(configuration.style);
  });
});
</script>

<style scoped>

</style>
