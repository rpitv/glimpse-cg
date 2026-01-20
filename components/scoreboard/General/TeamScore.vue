<template>
  <BaseTeamScore :team="team" />
</template>

<script lang="ts" setup>
import BaseTeamScore from '../TeamScore.vue';

defineProps<{
  team: 'awayTeam' | 'homeTeam';
}>();
</script>

<style>

</style>
