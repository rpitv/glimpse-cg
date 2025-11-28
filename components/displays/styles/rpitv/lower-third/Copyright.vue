<template>
  <div class="copyright-main">
    <div
      v-if="endGraphics.type === 'box'"
      class="center-graphics"
    >
      <div class="background">
        <span class="header">{{ endGraphics.title }}</span>
        <br>
        <span class="text">{{ endGraphics.message.trim() }}</span>
      </div>
    </div>
  </div>
  <div
    :style="copyrightContainer"
    class="center-copyright"
  >
    <span
      :style="copyrightText"
      class="background"
    >
      {{ copyright.text || "© RPI TV ALL RIGHTS RESERVED" }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';
import type { LowerThird } from '~/types/replicants';

const replicants = await useReplicants();
const endGraphics = replicants.lowerThird.endGraphics;
const copyright = replicants.lowerThird.copyright;

const copyrightContainer = computed((): CSSProperties => {
  return {
    bottom: copyright.offsetY + 10 + 'vh',
    left: copyright.offsetX + 'vw',
    position: 'absolute',
  };
});
const copyrightText = computed((): CSSProperties => {
  return {
    color: copyright.textColor || 'white',
    fontSize: copyright.textSize + 3 + 'vh',
    wordWrap: 'normal',
  };
});
</script>

<style scoped lang="scss">
@font-face {
	font-family: "Rubik";
	src: url('~/assets/rpitv-modern/Rubik.ttf');
}
div {
	font-family: "Rubik", sans-serif;
}

.copyright-main {

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	position: fixed;
	left: 50%;
	transform: translateX(-50%);
	bottom: 10vh;
}

.center-credits {
	text-align: center;
	font-size: 3vh;
	display: flex;
	justify-content: center;
	white-space: pre-line;

	.background {
		background-color: #B5B5B5;
		padding: 1vh;
		border-radius: 3vh;

		.header {
			width: 100%;
			color: #d6001c;
			font-size: 4vh;
			font-weight: bold;
			padding-bottom: 1vh;
		}

		.text {
			font-size: 3vh;
		}
	}
}

.center-copyright {
	width: 100vw;
	text-align: center;
	font-size: 3vh;
	font-weight: bold;
	.background {
		background: #DC001C;
		color: white;
		padding: 1vw;
		border-radius: 3vh;
	}
}
</style>
