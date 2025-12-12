<template>
  <div class="overflow-auto">
    <UCommandPalette
      :ui="{
        root: 'border border-muted border-solid',
      }"
      :groups
      :search-term="playerBio.description"
      :close="true"
      placeholder="Type in the descriptor or click on one"
      @update:model-value="(val) => playerBio.description = val.label || ''"
      @update:search-term="(val: string) => playerBio.description = val"
      @update:open="playerBio.description = ''"
    />
    <div class="flex gap-4 mt-4">
      <UFormField
        label="Info"
        help="Additional information about the player to display below their name and number."
      >
        <USwitch
          v-model="playerBio.info.show"
          label="Show Additional Info"
        />
      </UFormField>
      <UFormField
        label="Font Size"
        help="Adjust the font size of the player bio text."
      >
        <UInputNumber
          v-model="playerBio.fontSize"
          :step="0.1"
          :format-options="{ minimumFractionDigits: 1 }"
        />
      </UFormField>
    </div>
    <USeparator
      class="mt-4"
      size="md"
    />
    <div>
      <div
        v-if="!loading"
        class="mt-4 flex gap-4"
      >
        <div
          v-for="i in 2"
          :key="i"
          class="w-full"
        >
          <UInput
            v-if="i === 1"
            v-model="awaySearchPlayer"
            class="mt-2 w-full"
            size="md"
            variant="outline"
            placeholder="Search away player"
            @keydown.enter="toggleGraphic('away')"
          >
            <template #leading>
              <FontAwesomeIcon
                :icon="['fa', 'magnifying-glass']"
                class="inline-block align-middle"
              />
            </template>
          </UInput>
          <UInput
            v-else-if="i === 2"
            v-model="homeSearchPlayer"
            class="mt-2 w-full"
            size="md"
            variant="outline"
            placeholder="Search home player"
            @keydown.enter="toggleGraphic('home')"
          >
            <template #leading>
              <FontAwesomeIcon
                :icon="['fa', 'magnifying-glass']"
                class="inline-block align-middle"
              />
            </template>
          </UInput>
          <div class="max-height">
            <URadioGroup
              v-model="selectedPlayer"
              :color="i === 1 ? 'error' : 'success'"
              class="w-full mt-4"
              :items="i === 1 ? filteredAwayPlayers.map((player) => ({ name: player.name, value: { ...player } })) : filteredHomePlayers.map((player) => ({ name: player.name, value: { ...player } }))"
              label-key="name"
              variant="table"
              indicator="hidden"
              :ui="{
                item: '!rounded-none hover:bg-gray-100 dark:hover:bg-gray-800',
                root: 'h-[300px]',
              }"
              @update:model-value="updateSelectedPlayer(i)"
            >
              <template #label="{ item }">
                <div class="flex items-center gap-2">
                  <img
                    :src="item.value!.image"
                    alt="Player Image"
                    class="w-12 h-12 object-cover rounded"
                  >
                  <div class="text-left">
                    <div class="font-bold text-lg">
                      <span>#{{ item.value!.number }}</span> {{ item.value!.name }}
                    </div>
                  </div>
                </div>
              </template>
            </URadioGroup>
          </div>
        </div>
      </div>
      <div
        v-else
        class="w-full h-full text-center"
      >
        <UProgress />
        <p>Loading Players...</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { CommandPaletteGroup } from '@nuxt/ui';
import rpitvlogo from '~/assets/rpitv-modern/rpitv_logo.svg';

interface Player {
  // custom1: string | null;
  // custom2: string | null;
  height: string;
  hometown: string;
  image: string;
  name: string;
  number: string;
  // position: string;
  // previousTeam: string;
  weight: string;
  year: string;
}

const replicants = await useReplicants();
const configuration = replicants.configuration;
const awayTeam = computed(() => configuration.awayTeam);
const homeTeam = computed(() => configuration.homeTeam);
const awayPlayers = ref<Player[]>([]);
const homePlayers = ref<Player[]>([]);
const awayIndex = ref(0);
const homeIndex = ref(0);
const selectedPlayer = ref<Player | null>(null);
const awaySearchPlayer = ref('');
const homeSearchPlayer = ref('');
const loading = ref(true);
const playerBio = computed(() => replicants.lowerThird.playerBio);
const domParser = new DOMParser();

const groups = ref<CommandPaletteGroup[]>([
  {
    id: 'descriptor',
    label: 'Descriptors',
    items: [
      {
        label: 'Goal By',
      },
      {
        label: 'Penalty By',
      },
    ],
  },
]);

async function refresh() {
  loading.value = true;
  await $fetch('/api/playerbio').then((data) => {
    awayPlayers.value = setPlayers(data!.awayPlayers, 'away');
    homePlayers.value = setPlayers(data!.homePlayers, 'home');
  }).finally(() => {
    loading.value = false;
  });
}

function setPlayers(teamPlayers: { html: string; new: boolean }, team: 'home' | 'away'): Player[] {
  const teamDOM = domParser.parseFromString(teamPlayers.html, 'text/html');
  const players: Player[] = [];
  if (teamPlayers.new) {
    const playersGrid = teamDOM.querySelector('.c-rosterpage__players--rail');
    const playersDOM = playersGrid?.querySelectorAll('.s-person-card');
    playersDOM?.forEach((player) => {
      const name = player.querySelector('.s-person-card__header__person-details-personal__name')?.querySelector('span')?.textContent;
      const image = player.querySelector('[data-test-id="s-image-resized__img"]')?.getAttribute('src') || rpitvlogo;
      // const position = player.querySelector('[data-test-id="s-person-card-standard__content-person-details-position-short"]');
      // position?.querySelector('span')?.remove();
      const year = player.querySelector('[data-test-id="s-person-card-standard__content-person-details-academic-year-short"]');
      year?.querySelector('span')?.remove();
      const height = player.querySelector('[data-test-id="s-person-card-standard__content-person-details-height"]');
      height?.querySelector('span')?.remove();
      const weight = player.querySelector('[data-test-id="s-person-card-standard__content-person-details-weight"]');
      weight?.querySelector('span')?.remove();
      const hometown = player.querySelector('[data-test-id="s-person-card-standard__content-person-details-home-town"]');
      hometown?.querySelector('span')?.remove();
      hometown?.querySelector('svg')?.remove();
      const number = player.querySelector('[data-test-id="s-stamp__root"]')?.querySelector('span');
      number?.querySelector('span')?.remove();
      players.push({
        // custom1: null,
        // custom2: null,
        height: height?.textContent?.trim() as string,
        hometown: hometown?.textContent?.trim() as string,
        image: image,
        name: name as string,
        number: number?.textContent?.trim() as string,
        // position: position?.textContent?.trim() as string,
        // previousTeam: '',
        weight: weight?.textContent?.trim() as string,
        year: year?.textContent?.trim() as string,
      });
    });
  }
  else {
    const playersDOM = teamDOM.querySelectorAll('.sidearm-roster-player');
    playersDOM.forEach((player) => {
      let imageLink = null;
      if (player.querySelector('img')?.dataset.src) {
        imageLink = player.querySelector('img')?.dataset.src!
          .replace(/(width=)\d+/, '$1300')
          .replace(/(quality=)\d+/, '$170');
        // Schools such as yale do not have their images on their website, and source it from other websites.
        if (!imageLink?.startsWith('https'))
          imageLink = (team === 'home' ? homeTeam.value.athletics : awayTeam.value.athletics) + imageLink;
      }
      players.push({
        // custom1: player.querySelector('.sidearm-roster-player-custom1')?.textContent?.trim() ?? null,
        // custom2: player.querySelector('.sidearm-roster-player-custom2')?.textContent?.trim() ?? null,
        height: player.querySelector('.sidearm-roster-player-height')?.textContent?.trim() as string,
        hometown: player.querySelector('.sidearm-roster-player-hometown')?.textContent?.trim() as string,
        image: imageLink || rpitvlogo,
        name: player.querySelector('h3')?.textContent?.trim() as string || player.querySelector('h2')?.textContent?.trim() as string,
        number: player.querySelector('.sidearm-roster-player-jersey-number')?.textContent?.trim() as string,
        // position: player.querySelector('.sidearm-roster-player-position-long-short')?.textContent?.trim() as string,
        // previousTeam: player.querySelector('.sidearm-roster-player-highschool')?.textContent?.trim() as string,
        weight: player.querySelector('.sidearm-roster-player-weight')?.textContent?.trim() as string,
        year: player.querySelector('.sidearm-roster-player-academic-year')?.textContent?.trim() as string,
      });
    });
  }
  return players;
}

function updateSelectedPlayer(i: number) {
  if (selectedPlayer.value) {
    playerBio.value.teamside = i === 1 ? 'awayTeam' : 'homeTeam';
    playerBio.value.playerName = selectedPlayer.value.name;
    playerBio.value.playerNumber = selectedPlayer.value.number;
    // playerBio.value.position = selectedPlayer.value.position;
    playerBio.value.info.year = selectedPlayer.value.year;
    playerBio.value.info.height = selectedPlayer.value.height;
    playerBio.value.info.weight = selectedPlayer.value.weight;
    playerBio.value.info.hometown = selectedPlayer.value.hometown;
    // playerBio.value.previousTeam = selectedPlayer.value.previousTeam;
    // playerBio.value.custom1 = selectedPlayer.value.custom1;
    // playerBio.value.custom2 = selectedPlayer.value.custom2;
    playerBio.value.imageURL = selectedPlayer.value.image;
  }
  else {
    playerBio.value.playerName = '';
    playerBio.value.playerNumber = '';
    playerBio.value.position = '';
    playerBio.value.info.year = '';
    playerBio.value.info.height = '';
    playerBio.value.info.weight = '';
    playerBio.value.info.hometown = '';
    // playerBio.value.previousTeam = "";
    // playerBio.value.custom1 = null;
    // playerBio.value.custom2 = null;
    playerBio.value.imageURL = '';
  }
}

const filteredAwayPlayers = computed(() => {
  awayIndex.value = 0;
  const values = awaySearchPlayer.value.split(',').map(v => v.trim().toLowerCase()).filter(v => v !== '');
  if (values.length === 0) return awayPlayers.value;

  // Filter and sort by search value order
  const filtered = awayPlayers.value.filter(player =>
    values.some(value => player.name.toLowerCase().includes(value) || player.number === value),
  );

  // Sort by first matching search value index
  return filtered.sort((a, b) => {
    const aIndex = values.findIndex(value => a.name.toLowerCase().includes(value) || a.number === value);
    const bIndex = values.findIndex(value => b.name.toLowerCase().includes(value) || b.number === value);
    return aIndex - bIndex;
  });
});

const filteredHomePlayers = computed(() => {
  homeIndex.value = 0;
  const values = homeSearchPlayer.value.split(',').map(v => v.trim().toLowerCase()).filter(v => v !== '');
  if (values.length === 0) return homePlayers.value;

  const filtered = homePlayers.value.filter(player =>
    values.some(value => player.name.toLowerCase().includes(value) || player.number === value),
  );

  return filtered.sort((a, b) => {
    const aIndex = values.findIndex(value => a.name.toLowerCase().includes(value) || a.number === value);
    const bIndex = values.findIndex(value => b.name.toLowerCase().includes(value) || b.number === value);
    return aIndex - bIndex;
  });
});

function toggleGraphic(team: 'home' | 'away') {
  if (team === 'home') {
    if (filteredHomePlayers.value.length > 0 && homeSearchPlayer.value.trim() !== '') {
      selectedPlayer.value = filteredHomePlayers.value[homeIndex.value]!;
      if (replicants.channels[0]!.playerBio)
        homeIndex.value++;
      if (homeIndex.value >= filteredHomePlayers.value.length)
        homeIndex.value = 0;
    }
    updateSelectedPlayer(0);
  }
  else if (team === 'away') {
    if (filteredAwayPlayers.value.length > 0 && awaySearchPlayer.value.trim() !== '') {
      selectedPlayer.value = filteredAwayPlayers.value[0]!;
      if (replicants.channels[0]!.playerBio)
        awayIndex.value++;
      if (awayIndex.value >= filteredAwayPlayers.value.length)
        awayIndex.value = 0;
    }
    updateSelectedPlayer(1);
  }
  replicants.channels[0]!.playerBio = !replicants.channels[0]!.playerBio;
}

onMounted(() => {
  refresh();
});
</script>

<style scoped>
.max-height {
  max-height: 45vh;
  overflow-y: auto;
}
</style>
