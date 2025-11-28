<template>
  <div class="standings-editor">
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
        />
      </UFormField>

      <!-- <USelect :items="itemsTitle" label="Title" v-model="standings.title" /> -->
      <!-- <UTextarea label="Subtitle" v-model="standings.subtitle" /> -->
    </UCard>

    <!-- Team Configuration -->
    <UCard class="mb-4 rounded-none">
      <template #header>
        <h2>Team Configuration</h2>
      </template>
      <div class="btns">
        <UButton @click="fetchECACMenHockey">
          Fetch ECAC Hockey Men's
        </UButton>
        <UButton @click="fetchECACWomenHockey">
          Fetch ECAC Hockey Women's
        </UButton>
        <UButton @click="standings.teams = [...standings.teams, new StandingsTeam()]">
          Manually Add Team
        </UButton>
        <UButton @click="standings.teams = standings.teams.toSorted(sortByPosition)">
          Sort Teams in Editor
        </UButton>
        <UButton
          color="warning"
          :disabled="standings.teams.length === 0"
          @click="confirmReset"
        >
          Delete All Teams
        </UButton>
        <span>If position is 0, the team will not be displayed.</span>
      </div>
    </UCard>

    <!-- Teams List -->
    <table />
    <UCard class="rounded-none">
      <template #header>
        <h2>Teams</h2>
      </template>
      <div
        v-for="(team, i) in standings.teams"
        :key="i"
        class="team-form mb-4"
      >
        <UFormField label="Team Name">
          <UInput v-model="team.teamName" />
        </UFormField>
        <UFormField label="Position">
          <UInputNumber
            v-model="team.position"
            :min="0"
            :step="1"
          />
        </UFormField>
        <UFormField label="Team Record">
          <UInput v-model="team.record" />
        </UFormField>
        <UFormField label="Points">
          <UInputNumber
            v-model="team.points"
            :min="0"
            :step="0.5"
          />
        </UFormField>
        <ColorPicker
          v-model="team.teamColor"
          label="Team Color"
          help="The color of the team"
        />
        <UFormField label="Logo Link">
          <UInput v-model="team.logoLink" />
        </UFormField>
        <UButton
          color="error"
          @click="standings.teams = standings.teams.toSpliced(i, 1)"
        >
          Delete Team
        </UButton>
        <hr v-if="i < standings.teams.length - 1">
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { CommandPaletteGroup } from '@nuxt/ui';
import ColorPicker from '~/components/ColorPicker.vue';

const replicants = await useReplicants();
const standings = replicants.fullscreen.standings;
const channels = replicants.channels;
const search = ref('');
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

function sortByPosition(a: any, b: any) {
  if (a.position < b.position) return -1;
  if (a.position > b.position) return 1;
  return 0;
}

function confirmReset() {
  if (window.confirm('Are you sure you want to remove all standings?')) {
    standings.teams = [];
  }
}

function fetchECACHockeyRankings(men: boolean, link: string) {
  $fetch('/api/omni-fetch?url=' + encodeURIComponent(link))
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
          position: parseInt(i) + 1,
          teamColor: '',
          logoLink: teams_raw[i].logo ?? '',
          teamName: teams_raw[i].name ?? '',
          record: teams_raw[i].conference.wlt ?? '',
          points: parseFloat(teams_raw[i].conference?.pts) ?? 0,
        };
        teamBuilder.push(team);
      }
      standings.teams = [...standings.teams, ...teamBuilder];
    })
    .catch((e) => {
      console.error(e);
      if (window.confirm(`Failed to fetch ECAC ${men ? 'M' : 'Wom'}en"s Hockey Rankings Automatically!\nREASON >>> "${e}"\n\nDo you want to open the link in new tab and manually input the teams?`)) {
        window?.open(link, '_blank')?.focus();
      }
    });
}

function fetchECACMenHockey() {
  channels[0]!.standings = false;
  setTimeout(() => fetchECACHockeyRankings(true, ECAC_MENS_HOCKEY_URL), 1500);
}

function fetchECACWomenHockey() {
  channels[0]!.standings = false;
  setTimeout(() => fetchECACHockeyRankings(false, ECAC_WOMENS_HOCKEY_URL), 1500);
}

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
.btns {
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 1rem;
}
.team-form {
  margin-bottom: 2rem;
}
</style>
