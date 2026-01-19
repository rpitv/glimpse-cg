<template>
  <div class="overflow-auto">
    <UCommandPalette
      :ui="{
        root: 'border border-muted border-solid',
      }"
      :groups
      :search-term="playerBio.description"
      :close="playerBio.description.length > 0"
      placeholder="Type in the descriptor or click on one"
      @update:model-value="(val) => playerBio.description = val?.label || ''"
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
    <div class="mt-2">
      <div class="flex items-center">
        <p class="text-2xl">
          Player Cards
          <Info>
            <ul class="list-disc ml-3">
              <li>The graphic can also be toggled with <UKbd>Enter</UKbd> while in the input field.</li>
              <li>You can filter players by name or number.</li>
              <li>You can add players to filter with <UKbd>,</UKbd>.</li>
              <li>Pressing <UKbd>Enter</UKbd> cycles through the filtered players in order.</li>
            </ul>
          </Info>
        </p>
      </div>
      <div
        v-if="!loading"
        class="mt-4 flex gap-4"
      >
        <div class="w-full">
          <PlayerSearch
            :players="awayPlayers"
            color="error"
            placeholder="Search away player"
            @selected="onSelectedAway"
            @enter="() => toggleGraphic('away')"
          />
        </div>
        <div class="w-full">
          <PlayerSearch
            :players="homePlayers"
            color="success"
            placeholder="Search home player"
            @selected="onSelectedHome"
            @enter="() => toggleGraphic('home')"
          />
        </div>
      </div>
      <div
        v-else
        class="w-full h-full text-center mt-2"
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
import PlayerSearch from './PlayerSearch.vue';

interface Player {
  custom1: string | null;
  custom2: string | null;
  height: string;
  hometown: string;
  image: string;
  name: string;
  number: string;
  position: string;
  previousTeam: string;
  weight: string;
  year: string;
}

const replicants = await useReplicants();
const configuration = replicants.configuration;
const awayTeam = computed(() => configuration.awayTeam);
const homeTeam = computed(() => configuration.homeTeam);
const awayPlayers = ref<Player[]>([]);
const homePlayers = ref<Player[]>([]);
const selectedPlayer = ref<Player | null>(null);
const loading = ref(true);
const playerBio = replicants.lowerThird.playerBio;
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
    awayPlayers.value = setPlayers(data!.awayPlayers.html, 'away');
    homePlayers.value = setPlayers(data!.homePlayers.html, 'home');
  }).catch((e) => {
    console.error('Error fetching player data:', e);
  }).finally(() => {
    loading.value = false;
  });
}

function setPlayers(html: string, team: 'home' | 'away'): Player[] {
  const teamDOM = domParser.parseFromString(html, 'text/html');
  const players: Player[] = [];

  const scripts = teamDOM.querySelectorAll("script");
  for (const script in scripts) {
    const text = scripts[script]?.textContent;
    if (text?.startsWith("window.__INITIAL_STATE__")) {
      const jsonString = text
        .substring("window.__INITIAL_STATE__='".length, text.length - 1) // remove the starting assignment and closing '
        .replace(/\\'/g, "'") // escaped single quote ' get unescaped
        .replaceAll("\\\\", "\\") // escaped \ get unescaped
      console.log("HELLO");
      const data = JSON.parse(jsonString)
      // @ts-expect-error because making an interface for JSON format used this singular time is not worth it
      data["rostersModule"]["roster"][Object.keys(data["rostersModule"]["roster"])]["players"].forEach(player => {
        players.push({
          custom1: player["custom1"] ? player["custom1"] : "",
          custom2: player["custom2"] ? player["custom2"] : "",
          height: (player["heightFeet"] && player["heightInches"]) ? `${player["heightFeet"]}' ${player["heightInches"]}"` : "",
          hometown: player["hometown"] ? player["hometown"] : "",
          image: player["image"]["absoluteUrl"],
          name: `${player["firstName"]} ${player["lastName"]}`,
          number: player["jerseyNumberSecond"] ? player["jerseyNumberSecond"] : "",
          position: player["positionShort"] ? player["positionShort"] : "",
          previousTeam: player["highSchool"] ? player["highSchool"] : "",
          weight: player["weight"] ? `${player["weight"]} lbs` : "",
          year: player["academicYearShort"] ? player["academicYearShort"] : ""
        })
      });
      return players;
    }
  }
  const playersDOM = teamDOM.querySelectorAll(".sidearm-roster-player, .s-person-card");
  playersDOM.forEach((player) => {
    // processes image URLs into absolute URLs
    const originUrl = player.querySelector("img")?.dataset?.src || player.querySelector("img")?.src || ""
    let imgUrl;
    try {
      // attempts to verify url as absolute path
      imgUrl = new URL(originUrl).href;
    } catch (e) {
      // fails due to relative path, try adding domain
      try {
        imgUrl = new URL(originUrl, replicants.configuration[`${team}Team` as 'awayTeam' | 'homeTeam'].athletics).href;
      } catch (e) {
        // ultimate fail so resort to whatever the original is
        imgUrl = originUrl
      }
    }

    const imageLink = imgUrl
        .replace(/(width=)\d+/, "$1300")
        .replace(/(quality=)\d+/, "$170")
        .replace("/crop", "/convert") // converts cropping links to converter links
        .replace(/(height=)\d+/, "$1") // removes the height limiter since a width limiter exists
    players.push({
      custom1: player.querySelector(".sidearm-roster-player-custom1")?.textContent?.trim() ?? null,
      custom2: player.querySelector(".sidearm-roster-player-custom2")?.textContent?.trim() ?? null,
      height: player.querySelector(".sidearm-roster-player-height")?.textContent?.trim() as string ||
          player.querySelector("[data-test-id='s-person-details__bio-stats-person-season']")?.textContent?.replace(/height/gi, "")?.trim() as string,
      hometown: player.querySelector(".sidearm-roster-player-hometown")?.textContent?.trim() as string ||
          player.querySelector("[data-test-id='s-person-card-list__content-location-person-hometown']")?.textContent?.replace(/hometown/gi, "")?.trim() as string,
      image: imageLink || rpitvlogo,
      name: player.querySelector("h3")?.textContent?.trim() as string ||
          player.querySelector("h2")?.textContent?.trim() as string,
      number: player.querySelector(".sidearm-roster-player-jersey-number")?.textContent?.trim() as string ||
          player.querySelector("[data-test-id='s-stamp__root']")?.textContent?.replace(/jersey number/gi, "")?.trim() as string,
      position: 
          player.querySelector(".sidearm-roster-player-position-long-short")?.textContent?.trim() as string ||
          player.querySelector(".sidearm-roster-player-position > span.text-bold")?.textContent?.trim() as string ||
          player.querySelector("[data-test-id='s-person-details__bio-stats-person-position-short']")?.textContent?.replace(/position/gi, "")?.trim() as string,
      previousTeam: player.querySelector(".sidearm-roster-player-highschool")?.textContent?.trim() as string,
      weight: player.querySelector(".sidearm-roster-player-weight")?.textContent?.trim() as string, //|| player.querySelector("[data-test-id='s-person-details__bio-stats-person-weight']")?.textContent?.trim() as string,
      year: player.querySelector(".sidearm-roster-player-academic-year")?.textContent?.trim() as string ||
          player.querySelector("[data-test-id='s-person-details__bio-stats-person-title']")?.textContent?.replace(/academic year/gi, "")?.trim() as string,
    });
  });
  return players;
}

function updateSelectedPlayer(i: number) {
  if (selectedPlayer.value) {
    playerBio.teamside = i === 1 ? 'awayTeam' : 'homeTeam';
    playerBio.playerName = selectedPlayer.value.name;
    playerBio.playerNumber = selectedPlayer.value.number;
    // playerBio.position = selectedPlayer.value.position;
    playerBio.info.year = selectedPlayer.value.year;
    playerBio.info.height = selectedPlayer.value.height;
    playerBio.info.weight = selectedPlayer.value.weight;
    playerBio.info.hometown = selectedPlayer.value.hometown;
    // playerBio.previousTeam = selectedPlayer.value.previousTeam;
    // playerBio.custom1 = selectedPlayer.value.custom1;
    // playerBio.custom2 = selectedPlayer.value.custom2;
    playerBio.imageURL = selectedPlayer.value.image;
  }
  else {
    playerBio.playerName = '';
    playerBio.playerNumber = '';
    playerBio.position = '';
    playerBio.info.year = '';
    playerBio.info.height = '';
    playerBio.info.weight = '';
    playerBio.info.hometown = '';
    // playerBio.previousTeam = "";
    // playerBio.custom1 = null;
    // playerBio.custom2 = null;
    playerBio.imageURL = '';
  }
}

// selection is driven by child components via events

function onSelectedAway(player: Player) {
  selectedPlayer.value = player;
  updateSelectedPlayer(1);
}

function onSelectedHome(player: Player) {
  selectedPlayer.value = player;
  updateSelectedPlayer(0);
}

function toggleGraphic(team: 'home' | 'away') {
  const idx = team === 'home' ? 0 : 1;
  if (!replicants.channels[0]!.playerBio) {
    updateSelectedPlayer(idx);
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
