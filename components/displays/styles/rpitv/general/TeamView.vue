<template>
	<div class="team">
		<div class="logo">
			<img :src="team.logo" id="logoImg" :alt="team.schoolName">
		</div>
		<div class="team-name">
			{{ team.abbr }}
		</div>
		<div class="team-score">
			{{ scoreboardTeam.score }}
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Configuration, Scoreboard } from "~/types/replicants";
import { isLightColor, calcLinearGrad, isLighter } from "../../../util";


const props = defineProps({
  team: {
    type: String as PropType<"homeTeam" | "awayTeam">,
    required: true
  }
});
const configuration = useReplicant<Configuration>("configuration");
const scoreboard = useReplicant<Scoreboard>("scoreboard");
const team = computed(() => configuration.value![props.team]);
const scoreboardTeam = computed(() => scoreboard.value![props.team]);

const fontColor = ref("black");

const color1 = computed(() => {
	const linearGradient = calcLinearGrad(team.value.primaryColor);
	if (!isLighter(team.value.primaryColor, linearGradient))
		return linearGradient;
	return team.value.primaryColor;
})

const color2 = computed(() => {
	const linearGradient = calcLinearGrad(team.value.primaryColor);
	if (!isLighter(team.value.primaryColor, linearGradient))
		return team.value.primaryColor;
	return linearGradient;
})

if (isLightColor(color1.value)) fontColor.value = "white";
else fontColor.value = "black";

watch(color1, (n, o) => {
	if (isLightColor(n)) fontColor.value = "white";
	else fontColor.value = "black";
})

</script>

<style scoped>
.team {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: linear-gradient(v-bind(color1), v-bind(color2));
	font-size: 3.5vh;
	color: v-bind(fontColor);
	text-shadow: 0 0 0.2vh black;
}

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
