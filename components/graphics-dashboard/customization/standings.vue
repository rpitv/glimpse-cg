<template>
  <div class="standings-editor">
    <UModal v-model:open="showDeleteModal">
      <template #content>
        <div class="p-6">
          <h3 class="text-lg font-bold mb-2">
            Delete All Teams?
          </h3>
          <p class="mb-4">
            Are you sure you want to remove all standings? This action cannot be undone.
          </p>
          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="soft"
              @click="showDeleteModal = false"
            >
              Cancel
            </UButton>
            <UButton
              color="error"
              @click="deleteAllTeams"
            >
              Delete All
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
    <!-- Header Configuration -->
    <UCard class="mb-4 rounded-none">
      <template #header>
        <h2>Header Configuration</h2>
      </template>
      <div class="flex gap-4">
        <UCommandPalette
          :ui="{
            root: 'border border-muted border-solid',
          }"
          :groups="itemsTitle"
          :search-term="standings.title"
          :close="true"
          placeholder="Type in the title or click on one"
          @update:model-value="(val) => standings.title = val?.label || ''"
          @update:search-term="(val: string) => standings.title = val"
          @update:open="standings.title = ''"
        />
        <UCommandPalette
          :ui="{
            root: 'border border-muted border-solid',
          }"
          :groups="itemsLinks"
          :search-term="standings.headerLogoLink"
          :close="true"
          placeholder="Type in the header logo link or click on one"
          @update:model-value="(val) => standings.headerLogoLink = val?.label || ''"
          @update:search-term="(val: string) => standings.headerLogoLink = val"
          @update:open="standings.headerLogoLink = ''"
        />
      </div>
      <UFormField
        class="mt-4"
        label="Subtitle"
      >
        <UTextarea
          v-model="standings.subtitle"
          class="w-full"
          placeholder="Type in a subtitle for the standings graphic."
        />
      </UFormField>
    </UCard>

    <!-- Team Configuration -->
    <UCard class="mb-4 rounded-none">
      <template #header>
        <h2>Team Configuration</h2>
      </template>
      <UFieldGroup>
        <UButton
          variant="subtle"
          loading-auto
          @click="fetchECACMenHockey"
        >
          Fetch ECAC Hockey Men's
        </UButton>
        <UButton
          variant="subtle"
          loading-auto
          @click="fetchECACWomenHockey"
        >
          Fetch ECAC Hockey Women's
        </UButton>
        <UButton
          color="secondary"
          variant="subtle"
          @click="standings.teams = [...standings.teams, new StandingsTeam()]"
        >
          Manually Add Team
        </UButton>
        <UButton
          variant="subtle"
          color="error"
          :disabled="standings.teams.length === 0"
          @click="showDeleteModal = true"
        >
          Delete All Teams
        </UButton>
      </UFieldGroup>
    </UCard>
    <!-- Teams List -->
    <table>
      <thead>
        <tr>
          <th class="text-left p-2">
            Team Name
          </th>
          <th class="text-left p-2">
            Logo Link
          </th>
          <th class="text-left p-2">
            Record
          </th>
          <th class="text-left p-2">
            Points
          </th>
          <th class="text-center p-2">
            Action
          </th>
        </tr>
      </thead>
      <tbody class="my-table-tbody">
        <tr
          v-for="(team, i) in standingsRef"
          :key="i"
          class="border-t border-muted team-settings"
        >
          <td>
            <UInput
              v-model="standingsRef[i]!.teamName"
              placeholder="Team Name"
              class="w-full"
            />
          </td>
          <td>
            <UInput
              v-model="standingsRef[i]!.logoLink"
              placeholder="Logo Link"
              class="w-full"
            />
          </td>
          <td>
            <UInput
              v-model="standingsRef[i]!.record"
              placeholder="Record"
              class="w-full"
            />
          </td>
          <td>
            <UInputNumber
              v-model="standingsRef[i]!.points"
              :min="0"
              :step="0.5"
            />
          </td>
          <td>
            <div class="flex gap-2 justify-end">
              <UButton
                color="error"
                @click="standings.teams = standings.teams.toSpliced(i, 1)"
              >
                Delete
              </UButton>
            </div>
          </td>
        </tr>
        <tr v-if="standings.teams.length === 0">
          <td
            class="text-center text-muted w-full"
            colspan="5"
          >
            There are no teams. Use the buttons above to add teams.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { CommandPaletteGroup } from '@nuxt/ui';
import { useSortable } from '@vueuse/integrations/useSortable.mjs';

const replicants = await useReplicants();
const toast = useToast();
const standings = replicants.fullscreen.standings;
const channels = replicants.channels;
const standingsRef = computed({
  get: () => standings.teams,
  set: val => (standings.teams = val),
});
const search = ref('');
const showDeleteModal = ref(false);
const itemsTitle = ref<CommandPaletteGroup[]>([
  {
    id: 'titles',
    label: 'Titles',
    items: [
      {
        label: 'ECAC Standings',
      },
    ],
  },
]);
const itemsLinks = ref<CommandPaletteGroup[]>([
  {
    id: 'links',
    label: 'Header Logo Links',
    items: [
      {
        label: 'https://dbukjj6eu5tsf.cloudfront.net/ecachockey.com/images/responsive_2022/main_logo.svg',
      },
    ],
  },
]);

const ECAC_MENS_HOCKEY_URL = 'https://ecachockey.com/standings.aspx?path=mhockey';
const ECAC_WOMENS_HOCKEY_URL = 'https://ecachockey.com/standings.aspx?path=whockey';

function deleteAllTeams() {
  standings.teams = [];
  showDeleteModal.value = false;
  toast.add({
    title: 'All Teams Deleted',
    description: 'All teams have been removed from the standings.',
    color: 'success',
  });
}

async function fetchECACHockeyRankings(men: boolean, link: string) {
  return $fetch('/api/omni-fetch?url=' + encodeURIComponent(link))
    .then((data) => {
      const parser = new DOMParser();
      const resDom = parser.parseFromString(data, 'text/html');

      const teams_raw: any[] = [];
      resDom.querySelectorAll('#main-content > article > div.sidearm-table-overflow > table > tbody > tr')
        .forEach((row) => {
          const cols = row.querySelectorAll('td:not([aria-hidden=\'true\'])');
          let logoLink = (cols[0]?.querySelector('.sidearm-standings-school-logo img') as HTMLImageElement | null)?.src ?? '';
          try {
            const url = new URL(logoLink);
            logoLink = 'https://ecachockey.com/' + url.pathname;
          }
          catch (e) {}
          teams_raw.push({
            name: cols[0]?.textContent?.trim(),
            logo: logoLink,
            conference: {
              pts: cols[1]?.textContent ?? '',
              gp: cols[2]?.textContent ?? '',
              wlt: cols[3]?.textContent ?? '',
              otw_otl: cols[4]?.textContent ?? '',
              so_wl: cols[5]?.textContent ?? '',
              gf_ga: cols[6]?.textContent ?? '',
            },
            overall: {
              gp: cols[7]?.textContent ?? '',
              wlt: cols[8]?.textContent ?? '',
              gf_ga: cols[9]?.textContent ?? '',
            },
          });
        });

      const teamBuilder: any[] = [];
      for (const i in teams_raw) {
        const team: any = {
          // position: parseInt(i) + 1,
          // teamColor: '',
          logoLink: teams_raw[i].logo ?? '',
          teamName: teams_raw[i].name ?? '',
          record: teams_raw[i].conference.wlt ?? '',
          points: parseFloat(teams_raw[i].conference?.pts) ?? 0,
        };
        teamBuilder.push(team);
      }
      standings.teams = [...standings.teams, ...teamBuilder];
      toast.add({
        title: `ECAC ${men ? 'M' : 'Wom'}en's Hockey Rankings Fetched`,
        description: `Fetched ${teamBuilder.length} teams from ECAC ${men ? 'M' : 'Wom'}en's Hockey Rankings.`,
        color: 'success',
      });
    })
    .catch((e) => {
      console.error(e);
      toast.add({
        title: `Failed to fetch ECAC ${men ? 'M' : 'Wom'}en's Hockey Rankings`,
        description: `REASON >>> "${e}"\n\nYou can copy the link below and manually input the teams.\n\n${link}`,
        color: 'error',
      });
    });
}

function fetchECACMenHockey() {
  channels[0]!.standings = false;
  return fetchECACHockeyRankings(true, ECAC_MENS_HOCKEY_URL);
}

function fetchECACWomenHockey() {
  channels[0]!.standings = false;
  return fetchECACHockeyRankings(false, ECAC_WOMENS_HOCKEY_URL);
}

const sortableInstance = useSortable('.my-table-tbody', standingsRef, { animation: 150 });
watch(standingsRef, () => {
  if (standingsRef.value.length === 0) {
    sortableInstance.stop();
  }
  else {
    sortableInstance.start();
  }
}, { immediate: true });

watch(search, (val) => {
  standings.title = val;
});
</script>

<style scoped lang="scss">
.standings-editor {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
.team-form {
  margin-bottom: 2rem;
}
.team-settings > td {
  padding: 0.5rem;
}
</style>
