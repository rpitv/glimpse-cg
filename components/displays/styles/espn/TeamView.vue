<template>
	<div class="team-section">
		<div class="logo-section">
			<img v-if="team.logo" :src="team.logo" :alt="team.schoolName">
		</div>
		<div class="name-section">
			<p>
				{{ team.shortName }}
			</p>
		</div>
		<div class="score-section">
			<p>
				{{ scoreboardTeam.score }}
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { PropType } from "vue";

const props = defineProps({
	team: {
		type: String as PropType<"awayTeam" | "homeTeam">,
		required: true
	}
})

const replicants = await useReplicants();

const scoreboardTeam = replicants.scoreboard[props.team];
const team = replicants.configuration[props.team];
const logoBgColor = ref(scoreboardTeam.primaryColor);
</script>

<style scoped lang="scss">

.team-section {
	display: flex;
	font-family: 'Roboto', sans-serif;
	height: 100%;
}

.logo-section {
		display: inline-flex;
		justify-content: center;
		align-items: center;

		width: 3.5vw;
		height: 100%;

		background-color: v-bind(logoBgColor);

		img {
			height: 90%;
		}
	}

.name-section {
	display: inline-flex;
	align-items: center;
	width: 13.5vw;
	height: 100%;
	background-color: rgb(240,240,240);
	color: rgb(73,73,68);
	font-weight: 700;
	font-size: 1.7vw;
	p {
		margin-left: 0.6vw;
	}
}

.score-section {
	display: inline-flex;
	justify-content: right;
	align-items: center;
	background-color: rgb(240,240,240);
	color: rgb(73,73,68);
	font-weight: 900;
	font-size: 2.2vw;
	width: 4.5vw;
	height: 100%;

	p {
		margin-right: 0.2vw;
	}
}
</style>
