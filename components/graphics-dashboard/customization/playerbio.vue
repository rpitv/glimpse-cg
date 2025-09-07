<template>
  <div class="overflow-auto">
    <div class="flex gap-4">
      <UFormField label="Description" help="Text accompanying the player bio graphic.">
        <DebouncedInput v-model="playerBio.description" />
      </UFormField>
      <UFormField label="Font Size" help="Adjust the font size of the player bio text.">
          <DebouncedInputNumber v-model="playerBio.fontSize" :step="0.1" :format-options="{ minimumFractionDigits: 1 }" />
      </UFormField>
    </div>
    <UFormField class="mt-4" label="Info" help="Additional information about the player to display below their name and number.">
      <DebouncedSwitch v-model="playerBio.info.show" label="Show Additional Info" />
    </UFormField>
    <USeparator class="mt-4" size="md"/>
    <div class="mt-4 flex gap-4 max-height">
      <div v-if="!loading" v-for="i in 2" :key="i" class="w-full">
        <DebouncedInput v-if="i === 1" v-model="awaySearchPlayer" class="mt-2 w-full" icon="i-lucide-search" size="md" variant="outline" placeholder="Search away player" />
        <DebouncedInput v-else-if="i === 2" v-model="homeSearchPlayer" class="mt-2 w-full" icon="i-lucide-search" size="md" variant="outline" placeholder="Search home player" />
        <URadioGroup :color="i === 1 ? 'error' : 'success'" class="w-full mt-4"
          :items="i === 1 ? filteredAwayPlayers.map((player) => ({ name: player.name, value: { ...player } })) : filteredHomePlayers.map((player) => ({ name: player.name, value: { ...player } }))" label-key="name" variant="table" indicator="hidden" 
          :ui="{
            item: '!rounded-none hover:bg-gray-100 dark:hover:bg-gray-800',
          }" 
          v-model="selectedPlayer"
          @update:model-value="updateSelectedPlayer(i)"
        >
          <template #label="{ item }">
            <div class="flex items-center gap-2">
              <img :src="item.value.image" alt="Player Image" class="w-12 h-12 object-cover rounded" />
              <div class="text-left">
                <div class="font-bold"><span class="text-sm">#{{ item.value.number }}</span> {{ item.value.name }}</div>
                <div class="text-sm ">{{ item.value.position }} - {{ item.value.year }}</div>
              </div>
            </div>
          </template>
        </URadioGroup>
      </div>
      <div class="w-full h-full text-center" v-else>
        <UProgress></UProgress>
        <p>Loading Players...</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Configuration, LowerThird } from '~/types/replicants';
import rpitvlogo from "~/assets/rpitv-modern/rpitv_logo.svg";

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

const lowerThird = await useReplicant<LowerThird>("lowerThird");
const configuration = await useReplicant<Configuration>("configuration");
const awayTeam = computed(() => configuration.value!.awayTeam);
const homeTeam = computed(() => configuration.value!.homeTeam);
const awayPlayers = ref<Player[]>([]);
const homePlayers = ref<Player[]>([]);
const selectedPlayer = ref<Player | null>(null);
const awaySearchPlayer = ref("");
const homeSearchPlayer = ref("");
const loading = ref(true);

const playerBio = computed(() => lowerThird.value!.playerBio);
const domParser = new DOMParser();

async function refresh() {
  loading.value = true;
  await $fetch("/api/playerbio").then((data) => {
    awayPlayers.value = setPlayers(data.awayPlayers, "away");
    homePlayers.value = setPlayers(data.homePlayers, "home");
  });
  loading.value = false;
}

function setPlayers(teamPlayers: string, team: "home" | "away"): Player[] {
  const teamDOM = domParser.parseFromString(teamPlayers, "text/html");
  const playersDOM = teamDOM.querySelectorAll(".sidearm-roster-player");
  let players: Player[] = [];
  playersDOM.forEach((player) => {
    let imageLink = null;
    if (player.querySelector("img")?.dataset.src)
      imageLink = ((team === "home" ? homeTeam.value.athletics : awayTeam.value.athletics) + player.querySelector("img")?.dataset.src)
        .replace(/(width=)\d+/, '$1300')
        .replace(/(quality=)\d+/, '$170');
		players.push({
			custom1: player.querySelector(".sidearm-roster-player-custom1")?.textContent?.trim() ?? null,
			custom2: player.querySelector(".sidearm-roster-player-custom2")?.textContent?.trim() ?? null,
			height: player.querySelector(".sidearm-roster-player-height")?.textContent?.trim() as string,
			hometown: player.querySelector(".sidearm-roster-player-hometown")?.textContent?.trim() as string,
			image: imageLink || rpitvlogo,
			name: player.querySelector("h3")?.textContent?.trim() as string,
			number: player.querySelector(".sidearm-roster-player-jersey-number")?.textContent?.trim() as string,
			position: player.querySelector(".sidearm-roster-player-position-long-short")?.textContent?.trim() as string,
			previousTeam: player.querySelector(".sidearm-roster-player-highschool")?.textContent?.trim() as string,
			weight: player.querySelector(".sidearm-roster-player-weight")?.textContent?.trim() as string,
			year: player.querySelector(".sidearm-roster-player-academic-year")?.textContent?.trim() as string,
		});
	});
  return players;
}

function updateSelectedPlayer(i: number) {
  if (selectedPlayer.value) {
    playerBio.value.teamside = i === 1 ? "awayTeam" : "homeTeam";
    playerBio.value.playerName = selectedPlayer.value.name;
    playerBio.value.playerNumber = selectedPlayer.value.number;
    playerBio.value.position = selectedPlayer.value.position;
    playerBio.value.info.year = selectedPlayer.value.year;
    playerBio.value.info.height = selectedPlayer.value.height;
    playerBio.value.info.weight = selectedPlayer.value.weight;
    playerBio.value.info.hometown = selectedPlayer.value.hometown;
    // playerBio.value.previousTeam = selectedPlayer.value.previousTeam;
    // playerBio.value.custom1 = selectedPlayer.value.custom1;
    // playerBio.value.custom2 = selectedPlayer.value.custom2;
    playerBio.value.imageURL = selectedPlayer.value.image;
  } else {
    playerBio.value.playerName = "";
    playerBio.value.playerNumber = "";
    playerBio.value.position = "";
    playerBio.value.info.year = "";
    playerBio.value.info.height = "";
    playerBio.value.info.weight = "";
    playerBio.value.info.hometown = "";
    // playerBio.value.previousTeam = "";
    // playerBio.value.custom1 = null;
    // playerBio.value.custom2 = null;
    playerBio.value.imageURL = "";
  }
}

const filteredAwayPlayers = computed(() => 
  awayPlayers.value.filter((player) => 
    player.name.toLowerCase().includes(awaySearchPlayer.value.toLowerCase()) || player.number === awaySearchPlayer.value
  )
);

const filteredHomePlayers = computed(() => 
  homePlayers.value.filter((player) => 
    player.name.toLowerCase().includes(homeSearchPlayer.value.toLowerCase()) || player.number === homeSearchPlayer.value
  )
);

onMounted(() => {
  refresh();
});

</script>

<style scoped>
.max-height {
  max-height: 50vh;
  overflow-y: auto;
}
</style>