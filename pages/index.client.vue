<template>
  <div id="configuration-page">
    <UCard class="rounded-none">
      <template #header>
        <h1 class="text-2xl">Settings</h1>
      </template>
      <template #default v-if="configuration">
        <div>
          <UFormField label="Graphic Style">
            <USelect :class="width" :items="styles" v-model="configuration.style" />
          </UFormField>
        </div>
        <USeparator orientation="horizontal" :class="height" />
        <div>
          <UFormField label="Sport">
            <USelect :class="width" :items="sports" v-model="configuration.sport" @update:model-value="refresh()" />
          </UFormField>
        </div>
        <USeparator v-if="configuration.sport !== 'acha' && configuration.sport !== 'football'" orientation="horizontal" :class="height" />
        <div v-if="configuration.sport !== 'acha' && configuration.sport !== 'football'">
          <UFormField label="Type (Important for Rosters)">
            <USelect :class="width" :items="type" v-model="configuration.type" @update:model-value="refresh()"/>
          </UFormField>
        </div>
        <USeparator orientation="horizontal" :class="height" />
        <div class="flex gap-5">
          <TeamConfig @loadPreset="loadPreset" class="w-full" team-side="awayTeam" />
          <TeamConfig @loadPreset="loadPreset" class="w-full" team-side="homeTeam" />
        </div>
      </template>
    </UCard>
    <UCard class="rounded-none" id="schedule-card">
      <template #header>
        <h1 class="text-2xl">RPI Home Schedule</h1>
      </template>
      <div v-if="loading">
        <UProgress></UProgress>
        <p>Getting schedule...</p>
      </div>
      <div v-else>
        <URadioGroup ref="radioSchedule" id="schedule" :loop="true" indicator="hidden" variant="table" 
          value-key="val" :items="schedule" v-model="selectedSchool" 
          @dblclick="() => { if (selectedSchool?.preset) loadMatchup(selectedSchool?.preset) }"
        >
          <template #label="{ item }">
            <div :id="item.uni" class="flex items-center gap-2">
              <img class="schedule-logo" :src="item.val.opponentLogo?.src"></img>
              <div>
                <p class="text-muted text-left">{{ configuration?.type === 'men' ? '(MEN)' : '(WOMEN)' }}</p>
                <p class="text-left text-xl">{{ item.val.title }}</p>
                <p class="text-muted text-left">{{ item.val.description }}</p>
              </div>
            </div>
          </template>
        </URadioGroup>
        <UTooltip :disabled="!!selectedSchool?.preset" text="This school does not have a preset available." :delay-duration="0">
          <UButton class="mt-2" :disabled="!selectedSchool || !selectedSchool.preset" @click="() => { if (selectedSchool?.preset) loadMatchup(selectedSchool?.preset) }">Load Matchup</UButton>
        </UTooltip>
      </div>
    </UCard>
  </div>
</template>

<script lang="ts" setup>
import type { Configuration } from '~/types/replicants';
import schools from '~/assets/schools.json';
import TeamConfig from '~/components/configuration/teamConfig.vue';
import { URadioGroup } from '#components';

const toast = useToast();
const replicants = await useReplicants();
const configuration = replicants.configuration;
const width = 'w-48';
const height = 'h-5'

const styles = [{
  label: 'RPI TV',
  value: 'rpitv'
},
{
  label: 'ESPN',
  value: 'espn'
},
{
  label: 'Football',
  value: 'football'
}];

const sports = [{
  label: 'Hockey',
  value: 'hockey'
},
{
  label: 'ACHA',
  value: 'acha'
},
{
  label: 'Football',
  value: 'football'
},
{
  label: 'Basketball',
  value: 'basketball'
},
{
  label: 'Soccer',
  value: 'soccer'
}];

const type = [{
  label: 'Mens',
  value: 'men'
},
{
  label: 'Womens',
  value: 'women'
}];


interface Timeline {
  val: {
    description: string;
    title: string;
    opponentLogo?: {
      src: string;
      alt: string;
    };
    preset: Configuration['awayTeam' | 'homeTeam'] | null;
  }
  uni: string
}

const radioSchedule = useTemplateRef<typeof URadioGroup>('radioSchedule');

const schedule = ref<Timeline[]>([]);
const domParser = new DOMParser();
const loading = ref(false);
let scrollToView: null | number = null;

const selectedSchool = ref<Timeline['val']>();
function parseSidearmsSchedule(html: string, logoHTML: string, type: string): void {
  const grid = domParser.parseFromString(html, "text/html");
  const gridTable = grid.querySelector('.sidearm-table');
  const games = gridTable?.querySelectorAll('.sidearm-schedule-game') || [];

  const logos = domParser.parseFromString(logoHTML, "text/html");
  const logoElements = logos.querySelectorAll('.sidearm-schedule-game-opponent-logo');
  let current = false;
  for (let i = 0; i < games.length; i++) {
    if (!games[i].className.includes('sidearm-schedule-home-game'))
      continue;
    // Column Order:
    // Date | Time | At | Opponent | Location | TV | Radio | Result | Links
    const columns = games[i].querySelectorAll('td');
    const date = columns[0].textContent?.trim() || '';
    let time = toMilitaryTime(columns[1].textContent?.trim() || '');
    const opponent = columns[3].textContent?.trim() || '';
    const opponentLogo = logoElements[i]?.querySelector('img')?.getAttribute('data-src') || '';
    const preset = schools.find(s => opponent.includes(s.schoolName) || opponent.includes(s.shortName) || opponent.includes(s.abbr));

    const opponentData: Timeline = { 
      val: {
        description: new Date(`${date} ${time}`).toLocaleString([], {
          month: 'short', 
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit', 
          minute:'2-digit'
        }), 
        title: opponent, 
        opponentLogo: {
          src: `https://rpiathletics.com${opponentLogo}`,
          alt: logoElements[i]?.querySelector('img')?.getAttribute('alt') || ''
        },
        preset: preset || null as Configuration['awayTeam' | 'homeTeam'] | null,
      },
      uni: i.toString()
    };
    if (!current) {
      if (new Date(`${date} ${time}`).getTime() >= Date.now()) { 
        current = true;
        selectedSchool.value = opponentData.val;
        scrollToView = i;
      }
    }
    schedule.value.push(opponentData);
  }
}

function toMilitaryTime(t: string): string {
  const match = t.match(/^(\d{1,2}):(\d{2})(AM|PM)$/i);
  if (!match) return t;
  let hour = parseInt(match[1], 10);
  const minute = match[2];
  const period = match[3].toUpperCase();
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return `${hour.toString().padStart(2, '0')}:${minute}`;
}

async function refresh() {
  loading.value = true;
  schedule.value = [];
  const data = await $fetch(`/api/schedule`, {
  }).catch((error) => {
    console.error("Error fetching schedule:", error);
  });
  const { data: dataHTML, logos } = data as {
    data: string;
    logos: string;
  }
  parseSidearmsSchedule(dataHTML, logos, 'men');
  loading.value = false;
}

function loadMatchup(teamConfig: Configuration['awayTeam' | 'homeTeam']) {
  loadPreset('awayTeam', teamConfig);
  loadPreset('homeTeam', schools[0]!);
}

function loadPreset(teamSide: 'awayTeam' | 'homeTeam', school: Configuration['awayTeam' | 'homeTeam']) {
  // configuration[props.teamSide] = { ...school };
  configuration[teamSide].schoolName = school.schoolName;
  configuration[teamSide].shortName = school.shortName;
  configuration[teamSide].abbr = school.abbr;
  configuration[teamSide].teamName = school.teamName;
  configuration[teamSide].primaryColor = school.primaryColor;
  configuration[teamSide].secondaryColor = school.secondaryColor;
  configuration[teamSide].logo = school.logo;
  configuration[teamSide].athletics = school.athletics || '';
  configuration[teamSide].special = school.special || false;
  toast.add({
    title: 'Preset Loaded',
    description: `Loaded preset for ${school.schoolName}`,
    duration: 3000
  });
}

onMounted(async () => {
  await refresh();
});

watch((radioSchedule), () => {
  if (radioSchedule.value)
    document.getElementById(scrollToView?.toString() || '')?.scrollIntoView({ block: 'center'});

})
</script>

<style>
#configuration-page {
  display: grid;
  grid-template-columns: 7fr 4fr;
}


#schedule-card {
  min-height: 400px;
  min-width: 400px;
}

#schedule {
  padding: 5px 0;
  overflow-y: scroll;
  max-height: 500px;
  transition: color .3s ease;
  color: var(--ui-bg);
  mask-image: linear-gradient(transparent 0%, var(--ui-bg) 5%, var(--ui-bg) 95%, transparent 100%);
  transition: 1s;
}

.schedule-item {
  display: flex;
  color: rgb(32, 32, 32);
  transition: all .3s;
  outline: none;
}

.men {
  background: linear-gradient(180deg, rgb(153, 153, 255), rgb(130, 130, 255));
  transition: all 0.3s;
  border: 3px solid var(--ui-bg);
}

.women {
  background: linear-gradient(180deg, rgb(255, 141, 141), rgb(255, 112, 112) 40%);
  transition: all 0.3s;
  border: 3px solid var(--ui-bg);
}

.men:hover, .men:focus {
  transition: all .3s;
  border: 3px rgb(38, 78, 255) solid;
}

.women:hover, .women:focus {
  border: 3px rgb(255, 45, 45) solid;
  transition: all .3s;
}

.schedule-logo {
  filter: drop-shadow(0 0 3px rgb(0, 0, 0));
}

.schedule-content {
  > h2 {
    font-size: 1.1rem;
    margin: 0;
    padding: 0 10px;
    font-weight: bold;
  }
  > p {
    font-size: 0.9rem;
    margin: 0;
    padding: 0 10px;
    color: rgba(8, 8, 8, 0.637);
  }
}

.schedule:hover {
  color: rgba(231, 231, 231, 0.3);
}

.loading {
  color: white;
}
</style>