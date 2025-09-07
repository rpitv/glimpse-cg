<template>
  <div>
    <UCard class="rounded-none">
      <template #header>
        <p class="text-2xl">
          Graphics List
        </p>
      </template>
      <template #default>
        <div>
          <URadioGroup
            v-model="model"
            :items="computedGraphics"
            value-key="val"
            indicator="hidden"
            variant="table"
            :ui="{
              item: [
                'has-data-[state=checked]:bg-transparent has-data-[state=checked]:border-muted has-data-[state=checked]:z-0',
                'has-[[role=radio][data-state=checked]]:bg-primary/10',
                'has-[[role=radio][data-state=checked]]:border-primary/50',
                'has-[[role=radio][data-state=checked]]:z-[1]'
              ].join(' ')
            }"
          >
            <template #label="{ item }">
              <div class="text-left">
                <div class="flex justify-between">
                  <p class="text-xl">{{ item.label }}</p>
                  <DebouncedSwitch v-model="(currentChannel[item.val.reference as keyof Channel] as boolean)" :debounce="75" />
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
import type { Configuration, Channel, Channels } from '~/types/replicants';
import Bug from '../customization/bug.vue';
import Commentators from '../customization/commentators.vue';
import Copyright from '../customization/copyright.vue';
import EndGraphics from '../customization/endgraphics.vue';
import GoToBreak from '../customization/gotobreak.vue';
import Locator from '../customization/locator.vue';
import PlayerBio from '../customization/playerbio.vue';
import Credits from '../customization/credits.vue';

const channels = await useReplicant<Channels>("channels");
const configuration = await useReplicant<Configuration>("configuration");

const model = defineModel({
  type: Object as PropType<{
    name: string;
    component: Component | null;
  }>
});

const currentChannel = computed(() => {
  return channels.value![0];
});

interface Graphic {
  label: string;
  val: {
    name: string;
    component: any;
    reference: string;
  };
  restrictions: string[];
}

const graphics: Graphic[] = [
  {
    label: "Bottom Text Bar",
    val: { name: "bottomtextbar", component: null, reference: "bottomTextBar" },
    restrictions: ["rpitv"],
  },
  {
    label: "Bug",
    val: { name: "bug", component: markRaw(Bug), reference: "bug" },
    restrictions: [],
  },
  {
    label: "Commentators",
    val: { name: "commentators", component: markRaw(Commentators), reference: "commentators" },
    restrictions: [],
  },
  {
    label: "Copyright",
    val: { name: "copyright", component: markRaw(Copyright), reference: "copyright" },
    restrictions: [],
  },
  {
    label: "End Graphics",
    val: { name: "endgraphics", component: markRaw(EndGraphics), reference: "endGraphic" },
    restrictions: [],
  },
  {
    label: "Go To Break",
    val: { name: "gotobreak", component: markRaw(GoToBreak), reference: "goToBreak" },
    restrictions: [],
  },
  {
    label: "Locator",
    val: { name: "locator", component: markRaw(Locator), reference: "locator" },
    restrictions: [],
  },
  {
    label: "Player Bios",
    val: { name: "playerbio", component: markRaw(PlayerBio), reference: "playerBio" },
    restrictions: [],
  },
  {
    label: "Credits",
    val: { name: "credits", component: markRaw(Credits), reference: "credits" },
    restrictions: [],
  },
  {
    label: "Standings",
    val: { name: "standings", component: null, reference: "standings" },
    restrictions: [],
  },
];

const computedGraphics = computed(() => {
  return graphics.filter((graphic) => {
    if (graphic.restrictions.length === 0) return true;
    return graphic.restrictions.includes(configuration.value!.style);
  });
});

const selectedLowerThird = ref();

</script>

<style scoped>

</style>