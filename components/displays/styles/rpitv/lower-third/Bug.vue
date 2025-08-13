<template>
	<img :style="bugStyle" :src="bug">
</template>

<script setup lang="ts">
import bug from "~/assets/rpitv-modern/rpitvBug.png";
import { computed, type CSSProperties } from "vue";
import type { LowerThird } from "~/types/replicants";

const lowerThird = useState<LowerThird>("lowerThird");

const bugStyle = computed((): CSSProperties => {
	return {
		height: "100vh",
		left: lowerThird.value!.bug.offsetX + "vw",
		position: "absolute",
		bottom: lowerThird.value!.bug.offsetY + "vh",
		width: "100vw",
	}
});
</script>

<style scoped>
</style>
