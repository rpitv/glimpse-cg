<template>
  <div class="team" :style="teamContainer">
    <div class="logo">
      <img
        id="logoImg"
        :src="scoreboardTeam.logo || team.logo"
        :alt="scoreboardTeam.name || team.schoolName"
        :style="`height: ${scoreboardTeam.logoSize * (3.6 / 100)}vh;`"
      >
    </div>
    <div class="team-name">
      {{ scoreboardTeam.name || team.abbr }}
    </div>
    <div class="team-score">
      {{ scoreboardTeam.score }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { isLightColor, calcLinearGrad, isLighter } from '~/components/displays/util';

const props = defineProps({
  team: {
    type: String as PropType<'homeTeam' | 'awayTeam'>,
    required: true,
  },
});
const replicants = await useReplicants();
const team = replicants.configuration[props.team];
const scoreboardTeam = replicants.scoreboard[props.team];

const fontColor = ref('black');

const primaryColor = computed(() => scoreboardTeam.primaryColor || team.primaryColor)

const color1 = computed(() => {
  const linearGradient = calcLinearGrad(primaryColor.value);
  if (!isLighter(primaryColor.value, linearGradient))
    return linearGradient;
  return primaryColor.value;
});

const color2 = computed(() => {
  const linearGradient = calcLinearGrad(primaryColor.value);
  if (!isLighter(primaryColor.value, linearGradient))
    return primaryColor.value;
  return linearGradient;
});

if (isLightColor(color1.value)) 
  fontColor.value = 'white';
else 
  fontColor.value = 'black';

watch(color1, (n, o) => {
  if (isLightColor(n)) fontColor.value = 'white';
  else fontColor.value = 'black';
});

const teamContainer = computed((): CSSProperties => {
  return {
    alignItems: 'center',
    background: `linear-gradient(${color1.value}, ${color2.value})`,
    color: fontColor.value,
    display: 'flex',
    fontSize: '3.5vh',
    justifyContent: 'space-between',
    textShadow: '0 0 0.2vh black',
  };
})

</script>

<style scoped>
.logo {
	display: flex;
	align-items: center;
}

#logoImg {
	margin-left: 0.3vw;
	max-height: 3.6vh;
	max-width: 2.5vw;
	filter: drop-shadow(0 0 0.1vw black);
}
.team-score {
	margin-right: 0.5vw;
}

.team-name {
	position: absolute;
	left: 3vw;
}
</style>
