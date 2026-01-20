<template>
  <UCard
    id="schedule-card"
    class="rounded-none"
  >
    <template #header>
      <h1 class="text-2xl">
        Schedule
      </h1>
      <USwitch
        v-model="homeToggle"
        label="Only Show Home Games"
      />
    </template>

    <div v-if="loading">
      <UProgress />
      <p>Getting schedule...</p>
    </div>
    <div v-else>
      <URadioGroup
        id="schedule"
        ref="radioSchedule"
        v-model="selectedSchool"
        :loop="true"
        indicator="hidden"
        variant="table"
        value-key="val"
        :items="schedule.filter(g => {
          if (homeToggle)
            return g.val.homeGame
          return true
        })"
        @dblclick="() => { if (selectedSchool?.preset) emitLoadMatchup(selectedSchool?.preset) }"
      >
        <template #label="{ item }">
          <div
            :id="item.uni"
            class="flex items-center gap-2"
          >
            <img
              class="schedule-logo"
              :src="item.val.opponentLogo?.src"
            >
            <div>
              <p class="text-left text-xl">
                {{ item.val.title }}
              </p>
              <p class="text-muted text-left">
                {{ item.val.description }}
              </p>
            </div>
          </div>
        </template>
      </URadioGroup>
      <div class="flex items-center justify-between gap-2">
        <UTooltip
          :disabled="!!selectedSchool?.preset"
          text="This school does not have a preset available."
          :delay-duration="0"
        >
          <UButton
            class="mt-2"
            :disabled="!selectedSchool || !selectedSchool.preset"
            @click="() => { if (selectedSchool?.preset) emitLoadMatchup(selectedSchool?.preset) }"
          >
            Load Matchup
          </UButton>
        </UTooltip>
        <span
          v-if="lastUpdated != ''"
          id="lastUpdated"
          class="flex items-center gap-2"
        >
          <span>Last Updated: {{ lastUpdated }}</span>
          <UButton @click="refresh(true)">
            <UIcon
              name="material-symbols-light:sync"
              class="size-full"
            />
          </UButton>
        </span>
      </div>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import type { RadioGroupProps } from '@nuxt/ui';
import type { Configuration } from '~/types/replicants';
import schools from '~/assets/schools.json';
import type { ScheduleResults } from '~/server/api/schedule';

const props = defineProps<{ configuration: Configuration }>();
const emit = defineEmits(['load-matchup']);

export interface Timeline {
  val: {
    description: string;
    title: string;
    type: string;
    homeGame: boolean;
    opponentLogo?: {
      src: string;
      alt: string;
    };
    preset: Configuration['awayTeam' | 'homeTeam'] | null;
  };
  uni: string;
}

const lastUpdated = ref('');
const homeToggle = ref(true);
const radioSchedule = useTemplateRef<RadioGroupProps>('radioSchedule');
const schedule = ref<Timeline[]>([]);
const loading = ref(false);
let scrollToView: null | number = null;
const selectedSchool = ref<Timeline['val']>();

async function refresh(force = false) {
  loading.value = true;
  schedule.value = [];
  const data: ScheduleResults = await $fetch(`/api/schedule?force=${force}`, {}).catch((error) => {
    console.error('Error fetching.ts schedule:', error);
  });

  let current = false;
  for (let i = 0; i < data.games.length; i++) {
    const game = data.games[i]!;
    const preset = schools.find(s => game.opponent.includes(s.schoolName) || game.opponent.includes(s.shortName) || game.opponent.includes(s.abbr));
    const opponentData: Timeline = {
      val: {
        description: new Date(game.date).toLocaleString([], {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        homeGame: game.homeGame,
        title: `${game.opponent} @ ${game.location}`,
        type: props.configuration?.type || 'mens',
        opponentLogo: {
          src: game.opponentLogo,
          alt: game.opponentLogoAlt,
        },
        preset: preset || null as Configuration['awayTeam' | 'homeTeam'] | null,
      },
      uni: i.toString(),
    };
    if (!current) {
      if (new Date(game.date).getTime() >= Date.now() && game.homeGame) {
        current = true;
        selectedSchool.value = opponentData.val;
        scrollToView = i;
      }
    }
    schedule.value.push(opponentData);
  }
  lastUpdated.value = new Date(data.lastUpdated).toLocaleString();
  loading.value = false;
}

function emitLoadMatchup(teamConfig: Configuration['awayTeam' | 'homeTeam'] | null) {
  emit('load-matchup', teamConfig);
}

onMounted(async () => {
  await refresh();
});

watch((radioSchedule), () => {
  if (radioSchedule.value) {
    document.getElementById(scrollToView?.toString() || '')?.scrollIntoView({ block: 'center' });
  }
});

defineExpose({
  refresh,
});
</script>

<style scoped>
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
  width: 100px;
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
