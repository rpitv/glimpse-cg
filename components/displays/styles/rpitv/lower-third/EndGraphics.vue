<template>
  <div
    v-if="endGraphics.type === 'scroll'"
    class="body"
  >
    <div class="fade" />
    <section class="scroll-text">
      <div
        :class="{ crawl: showCrawl }"
        :style="{ animationDuration: `${endGraphics.length}s` }"
      >
        <h1 class="title">
          {{ endGraphics.title }}
        </h1>
        <h2>{{ endGraphics.message }}</h2>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const replicants = await useReplicants();
const channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);
const channels = replicants.channels;
const endGraphics = replicants.lowerThird.endGraphics;
const showCrawl = ref(false);

const endGraphicActive = computed(() => channels[channelIndex.value].endGraphic);

watch(endGraphicActive, (newValue, oldValue) => {
  if (oldValue) {
    endGraphics.disabled = true;
    setTimeout(() => {
      endGraphics.disabled = false;
      channels[channelIndex.value].endGraphic = false;
      showCrawl.value = false;
    }, 1000);
  }
  else
    showCrawl.value = true;
});
</script>

<style scoped>
/* modified from https://css-tricks.com/snippets/css/star-wars-crawl-text */
.body {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
	white-space: pre-line;
	text-align: center;
	z-index: 3000;
}

.fade {
	position: relative;
	width: 100%;
	min-height: 75vh;
	top: -25px;
}

.scroll-text {
	display: flex;
	justify-content: center;
	position: relative;
	height: 800px;
	color: #feda4a;
	font-family: 'Pathway Gothic One', sans-serif;
	font-size: 500%;
	font-weight: 600;
	letter-spacing: 6px;
	line-height: 150%;
	perspective: 800px;
	text-align: center;
	-webkit-text-stroke: 7px black;
}

.crawl {
	position: relative;
	top: 99999px;
	transform-origin: 50% 100%;
	animation: crawl linear 30s infinite;
}

.crawl > .title {
	font-size: 200%;
	text-align: center;
}

.crawl > .title h1 {
	margin: 0 0 100px;
	text-transform: uppercase;
}

@keyframes crawl {
	0% {
		top: -100px;
		transform: rotateX(20deg) translateZ(0);
	}
	100% {
		top: -6000px;
		transform: rotateX(25deg) translateZ(-2500px);
	}
}
</style>
