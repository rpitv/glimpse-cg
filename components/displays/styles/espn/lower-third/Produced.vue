<template>
	<div id="container" :class="{
			show: channels![channelIndex].produced,
			hide: channels![channelIndex].produced,
			translateUp: channels![channelIndex].copyright,
			translateNone: !channels![channelIndex].copyright
		}">
		<img id="ESPNCopyrightImg" :src="ESPN_Copyright">
		<img id="logo" :src="RPITV_LOGO">
		<span id="Text">Produced by RPI TV</span>
	</div>
</template>

<script setup lang="ts">
import ESPN_Copyright from "~/assets/espn/ESPN_Copyright.png"
import RPITV_LOGO from "~/assets/rpitv-modern/rpitv_logo.svg"
import type { LowerThird, Channels } from "~/types/replicants";

const lowerThird = useState<LowerThird>("lowerThird");
const route = useRoute();
let channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);

const channels = useState<Channels>("channels");

</script>

<style scoped lang="scss">
@font-face {
	font-family: "swiss721_bold";
	src: url('~/assets/espn/Swiss721Bold.ttf')
}

#container.translateUp {
	transform: translateY(-15.5vh);
}

#container.translateNone {
	transform: none;
}

#logo {
	position: absolute;
	left: 7vw;
	top: 82.6vh;
	height: 8vw;
}

#ESPNCopyrightImg {
	position: absolute;
	top: 0;
	left: 0;

	width: 100vw;
	height: 100vh;

	transition: opacity 1s;
}

#Text {
	font-family: "swiss721_bold";
	position: absolute;
	font-size: 3.3vh;
	top: 88vh;
	left: 20vw;
}

.hide {
	opacity: 0;
	transition: 1s;
}

.show {
	opacity: 1;
	transition: 1s;
}
</style>
