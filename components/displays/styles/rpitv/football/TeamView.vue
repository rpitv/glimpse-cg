<template>
	<div class="team">
		<div class="team-info">
			<img :src="team.logo" class="logo">
			<div class="team-name">
				{{ team.abbr }}
			</div>
		</div>
		<div class="team-score">
			{{ score.toFixed(0) }}
		</div>
	</div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";
import { isLightColor, calcLinearGrad, isLighter } from "../../../util";
import gsap from "gsap";
import type { Configuration, Scoreboard } from "~/types/replicants";

const props = defineProps({
	team: {
		type: String as PropType<"homeTeam" | "awayTeam">,
		required: true
	}
})

const configuration = await useReplicant<Configuration>("configuration");
const scoreboard = await useReplicant<Scoreboard>("scoreboard");
const team = computed(() => configuration.value![props.team]);
const scoreboardTeam = computed(() => scoreboard.value![props.team]);

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

const color3 = computed(() => {
	const linearGradient = calcLinearGrad(team.value.secondaryColor);
	if (!isLighter(team.value.secondaryColor, linearGradient))
		return linearGradient;
	return team.value.secondaryColor;
})

const color4 = computed(() => {
	const linearGradient = calcLinearGrad(team.value.secondaryColor);
	if (!isLighter(team.value.secondaryColor, linearGradient))
		return team.value.secondaryColor;
	return linearGradient;
})

const nameColor = computed(() => isLightColor(team.value.primaryColor) ? "white" : "black");
const scoreColor = computed(() => isLightColor(team.value.secondaryColor) ? "white" : "black");

const score = computed(() => scoreboardTeam.value.score);
watch(score, (n, o) => {
	const t1 = gsap.timeline();
	t1.to(score, { duration: 1, value: Number(n), ease: "power1.out"}, "+=8")
})

</script>

<style scoped lang="scss">

.team {
	display: grid;
	grid-template-columns: 2fr 1fr;
	align-items: center;
	align-content: center;
	background: linear-gradient(v-bind(color1), v-bind(color2));
	width: 16vw;
	height: 6.2vh;
}

.team-info {
	display: grid;
	grid-template-columns: 4fr 9fr;
	align-items: center;
}

.team-name {
	color: v-bind(nameColor);
	text-align: center;
	font-family: "Malgun Gothic";
	font-weight: bolder;
	text-shadow: 0.1vw 0.1vw 0.6vh #292929;
	font-size: 4.63vh;
}

.team-score {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 6.2vh;
	background: linear-gradient(v-bind(color3), v-bind(color4));
	font-size: 4.63vh;
	color: v-bind(scoreColor);
	text-shadow: 0.1vw 0.1vw 0.6vh #292929;
	font-family: "Malgun Gothic";
	font-weight: bold;

}

.logo {
	max-width: 3vw;
	max-height: 5vh;
	filter: drop-shadow(0.5vh 0.3vh 0.3vh #292929);
	padding-left: 0.3vw;
}
</style>
