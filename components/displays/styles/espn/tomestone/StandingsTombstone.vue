<template>
    <TombstoneBuilder class="tombstone">
        <div class="header">
            <img class="header-img" :src="standings.headerLogoLink" alt="">
            <div class="header-text">
                <span class="header-main">{{ standings.title }}</span>
                <span class="header-sub">{{ standings.subtitle }}</span>
            </div>
        </div>
        <table>
            <thead>
            <tr>
                <td></td>
                <td class="name">TEAM</td>
                <td class="record">CON REC</td>
                <td class="points">PTS</td>
            </tr>
            </thead>
            <tbody v-for="team in standings.teams.filter(team => 0 < team.position).sort(sortByPosition)">
            <tr>
                <td class="logo" :style="{'background': team.teamColor}"><img :src="team.logoLink" alt=""></td>
                <td class="name">{{ team.teamName }}</td>
                <td class="record">{{ team.record }}</td>
                <td class="points">{{ team.points }}</td>
            </tr>
            </tbody>
        </table>
    </TombstoneBuilder>
</template>

<script setup lang="ts">
import { StandingsTeam } from "~/utils/standings";
import TombstoneBuilder from "./TombstoneBuilder.vue";
import type { Fullscreen } from "~/types/replicants";

const fullscreen = useReplicant<Fullscreen>("fullscreen");
const standings = computed(() => fullscreen.value!.standings);

function sortByPosition(a: StandingsTeam, b: StandingsTeam) {
  if (a.position < b.position)
      return -1;
if (a.position > b.position)
    return 1;
  return 0;
}
</script>

<style scoped lang="scss">
@font-face {
    font-family: "swiss721_bold";
    src: url('../../../../../assets/espn/Swiss721Medium.ttf')
}

.tombstone {
    font-family: "swiss721_med";
    bottom: 7vh;
    left: 5vw;
    width: 36vw;
}

.header {
    background-color: white;
    display: flex;
    align-items: center;
    padding: 0.5vw;
}

.header-img {
    height: 4vh;
}

.header-text {
    display: flex;
    flex-direction: column;
    padding-left: 1vw;
}

.header-main {
    font-size: 4.2vh;
}

.header-sub {
    font-size: 2vh;
    white-space: pre-wrap;
}

table, th, td {
    border: 4px solid #B4B4B4;
    border-collapse: collapse;
}

table {
    width: 100%;
    background: #ececee;
}

tr {
    height: 2.8vh;
}

tbody td {
    padding-left:  0.5vw;
    padding-right: 0.5vw;
}

td.logo {
    width: 4vw;
    height: inherit;
}

td.logo img {
    height: 3.5vh;
    display: block;
    margin: auto;
}

td.name {
    width: 18vw;
    font-size: 2.5vh;
    padding-left: 0.5vw;
}

td.record {
    width: 8vw;
    font-size: 2.5vh;
    text-align: center;
}

td.points {
    width: 4vw;
    font-size: 2.5vh;
    text-align: center;
}
</style>
