<template>
  <UCard id="schedule-card">
    <template #header>
      <h1 class="text-2xl">RPI Home Schedule</h1>
    </template>
    <div v-if="loading">
      <UProgress></UProgress>
      <p>Getting schedule...</p>
    </div>
    <div v-else>
      <URadioGroup id="schedule" :loop="true" indicator="hidden" variant="table" 
        value-key="val" :items="schedule" v-model="selectedSchool" 
        @dblclick="() => { if (selectedSchool?.preset) emit('loadMatchup', selectedSchool?.preset) }"
      >
        <template #label="{ item }">
          <div :id="item.id" class="flex items-center gap-2">
            <img class="schedule-logo" :src="item.val.opponentLogo?.src"></img>
            <div>
              <p class="text-muted text-left">{{ item.val.type === 'women' ? '(WOMEN)' : '(MEN)' }}</p>
              <p class="text-left text-xl">{{ item.val.title }}</p>
              <p class="text-muted text-left">{{ item.val.description }}</p>
            </div>
          </div>
        </template>
      </URadioGroup>
      <UTooltip :disabled="!!selectedSchool?.preset" text="This school does not have a preset available." :delay-duration="0">
        <UButton class="mt-2" :disabled="!selectedSchool || !selectedSchool.preset" @click="emit('loadMatchup', selectedSchool?.preset)">Load Matchup</UButton>
      </UTooltip>

      <!-- <div id="schedule">
        <div v-for="(item, index) in schedule" :key="index" :tabindex="0" :class="`schedule-item ${item.type === 'men' ? 'men' : 'women'}`" @focus="select(item)" @focusout="selectedSchool = null">
          <div class="schedule-logo">
            <img v-if="item.opponentLogo" :src="item.opponentLogo.src" :alt="item.opponentLogo.alt" />
          </div>
          <div class="schedule-content">
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div> -->
    </div>
  </UCard>

</template>

<script lang="ts" setup>
import schools from '~/assets/schools.json';
import type { Configuration } from '~/types/replicants';

interface Timeline {
  val: {
    description: string;
    title: string;
    type: string;
    opponentLogo?: {
      src: string;
      alt: string;
    };
    preset: Configuration['awayTeam' | 'homeTeam'] | null;
  }
  id: string
}

const channel = useState('channel');

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
        type,
        opponentLogo: {
          src: `https://rpiathletics.com${opponentLogo}`,
          alt: logoElements[i]?.querySelector('img')?.getAttribute('alt') || ''
        },
        preset: preset || null as Configuration['awayTeam' | 'homeTeam'] | null,
      },
      id: i.toString()
    };
    // new Date("December 5, 2025").getTime()
    if (!current) {
      if (new Date(`${date} ${time}`).getTime() >= new Date("December 5, 2025").getTime()) { 
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
  schedule.value = [];
  loading.value = true;
  const data = await $fetch(`http://localhost:3000/api/schedule?channel=${channel.value}`, {
  }).catch((error) => {
    console.error("Error fetching schedule:", error);
  });
  const { mens, womens, mensLogo, womensLogo } = data as {
    mens: string;
    womens?: string;
    mensLogo: string;
    womensLogo?: string;
  }
  parseSidearmsSchedule(mens, mensLogo, 'men');
  if (womens && womensLogo)
    parseSidearmsSchedule(womens, womensLogo, 'women');
  schedule.value.sort((a, b) => {
    const dateA = new Date(a.val.description as string);
    const dateB = new Date(b.val.description as string);
    return dateA.getTime() - dateB.getTime();
  });
  loading.value = false;
}

function scrollInitial() {
  document.getElementById(scrollToView?.toString() || '')?.scrollIntoView({ block: 'center'});
}

const emit = defineEmits(['loadMatchup']);

onMounted(async () => {
  await refresh();
  scrollInitial();
});

defineExpose({
  refresh,
  scrollInitial
});
</script>

<style>

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