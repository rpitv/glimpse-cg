<template>
  <div>
    <svg class="fullscreen" id="Layer_1"  data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1639.76 139.48">
      <g>
        <rect class="cls-7" x="7.6" y="6.6" width="1622.3" height="126.91"/>
        <rect class="cls-12" x="1443.99" y="1" width="195.77" height="138.48"/>
        <rect class="cls-1" width="195.77" height="139.48"/>
        <rect class="cls-3" x="18.33" y="14.95" width="1603.91" height="111.58"/>
        <rect class="cls-9" x="18.33" y="73.14" width="1603.91" height="53.39"/>
      </g>
    </svg>
    <div class="commentators">
      <div class="container" v-for="(c, i) in commentators.people" :key="i">
        <p :style="{
          color: commentators.people[i]!.nameColor || 'black',
          fontSize: commentators.people[i]!.nameSize + 4 + 'vh',
        }">{{ commentators.people[i]?.name }}</p>
      </div>
    </div>
    <div class="description">
      <div class="container" v-for="(c, i) in commentators.people" :key="i">
        <p :style="{
          color: commentators.people[i]!.descriptionColor || 'white',
          fontSize: commentators.people[i]!.descriptionSize + 2.7 + 'vh',
          fontStyle: 'italic'
        }">{{ commentators.people[i]?.description }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

const replicants = await useReplicants();
const channels = replicants.channels;
const commentators = replicants.lowerThird.commentators;

const props = defineProps({
  preview: {
    type: Boolean,
    default: false
  }
});

gsap.registerPlugin(CustomEase);

// Simple animation 
watch(() => channels[0]?.commentators, (newCommentators, oldCommentators) => {
  if (!props.preview)
    if (newCommentators !== oldCommentators) {
      if (newCommentators) {
        gsap.to('#Layer_1', { top: '36vh', duration: 1.25 });
        gsap.to('.commentators', { top: '80.5vh', duration: 1.25 });
        gsap.to('.description', { top: '85.5vh', duration: 1.25 });
      }
      else {
        gsap.to('#Layer_1', { top: '58.5vh', duration: 1.25 });
        gsap.to('.commentators', { top: '103vh', duration: 1.25 });
        gsap.to('.description', { top: '108vh', duration: 1.25 });
      }
    }
});

onMounted(() => {
  if (!props.preview) {
    if (!channels[0]?.commentators) {
      gsap.to('#Layer_1', { top: '58.5vh', duration: 0 });
      gsap.to('.commentators', { top: '103vh', duration: 0 });
      gsap.to('.description', { top: '108vh', duration: 0   });
    }
  }
})
</script>

<style scoped>
#Layer_1 {
  top: 36vh;
  width: 85vw;
  left: 7.5vw;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

.fullscreen {
  position: absolute;
  height: 100vh;
  width: 100vw;
}

.commentators {
  width: 85vw;
  height: 6vh;
  left: 7.5vw;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  top: 80.5vh;
}

.description {
  width: 85vw;
  height: 6vh;
  left: 7.5vw;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  top: 85.5vh;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  height: 100%;
  gap: 1vh;
  font-weight: 600;
  
}

.cls-1 {
  fill: #d31245;
}

.cls-2 {
  letter-spacing: -.02em;
}

.cls-3, .cls-4 {
  fill: #fff;
}

.cls-5 {
  letter-spacing: 0em;
}

.cls-6 {
  letter-spacing: -.02em;
}

.cls-7 {
  opacity: .8;
}

.cls-8 {
  letter-spacing: -.01em;
}

.cls-9 {
  fill: #262823;
}

.cls-10 {
  letter-spacing: 0em;
}

.cls-11 {
  letter-spacing: -.02em;
}

.cls-12 {
  fill: #00549c;
}

.cls-13 {
  letter-spacing: -.02em;
}

.cls-14 {
  letter-spacing: 0em;
}

</style>