<template>
  <div>
    <svg
      class="fullscreen"
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1920 1080"
    >
      <g id="Left_Namebar">
        <rect
          class="cls-11"
          x="-1.23"
          y="864.91"
          width="947.82"
          height="126.91"
        />
        <rect
          class="cls-19"
          x="760.76"
          y="859.32"
          width="195.77"
          height="138.48"
        />
        <rect class="cls-1" x="-1.23" y="859.32" width="195.77" height="139.48" />
        <rect class="cls-6" x="-1.23" y="873.27" width="939.37" height="111.58" />
        <rect class="cls-13" y="931.46" width="938.14" height="53.39" />
        <text class="cls-22" transform="translate(148.85 915.76)" x="80" text-anchor="middle"
          :style="{
            fill: commentators.people[0]?.nameColor || 'black',
            fontSize: (commentators.people[0]?.nameSize || 0) + 45 + 'px',
          }"
        >
          {{ commentators.people[0]?.name }}
        </text>
        <text class="cls-8" transform="translate(215.81 967.34)" x="14" text-anchor="middle"
          :style="{
            fill: commentators.people[0]?.descriptionColor || 'white',
            fontSize: (commentators.people[0]?.descriptionSize || 0) + 33.9 + 'px',
          }"
        >
          {{ commentators.people[0]?.description }}
        </text>
        <text class="cls-22" transform="translate(496.47 915.76)" x="210" text-anchor="middle"
          :style="{
            fill: commentators.people[1]?.nameColor || 'black',
            fontSize: (commentators.people[1]?.nameSize || 0) + 45 + 'px',
          }"
        >
          {{ commentators.people[1]?.name }}
        </text>
        <text class="cls-8" transform="translate(573.25 969.34)" x="132" text-anchor="middle"
          :style="{
            fill: commentators.people[1]?.descriptionColor || 'white',
            fontSize: (commentators.people[1]?.descriptionSize || 0) + 33.9 + 'px',
          }"
        >
          {{ commentators.people[1]?.description }}
        </text>
      </g>
      <g id="Right_Namebar">
        <rect
          class="cls-11"
          x="1262.05"
          y="868.49"
          width="663.93"
          height="123.48"
        />
        <rect
          class="cls-19"
          x="1252.76"
          y="862.15"
          width="195.77"
          height="135.65"
        />
        <rect
          class="cls-1"
          x="1730.21"
          y="862.15"
          width="195.77"
          height="136.65"
        />
        <rect
          class="cls-6"
          x="1266.32"
          y="875.84"
          width="655.62"
          height="109.3"
        />
        <text class="cls-22" transform="translate(1502.2742 915.7588)" x="92" y="0" text-anchor="middle"
          :style="{
            fill: commentators.people[2]?.nameColor || 'black',
            fontSize: (commentators.people[2]?.nameSize || 0) + 45 + 'px',
          }"
        >
          {{ commentators.people[2]?.name }}
        </text>
        <rect
          class="cls-13"
          x="1266.33"
          y="931.46"
          width="655.62"
          height="53.68"
        />
        <text class="cls-7" transform="translate(1314.3388 964.3369)" x="278" text-anchor="middle"
          :style="{
              fill: commentators.people[2]?.descriptionColor || 'white',
              fontSize: (commentators.people[2]?.descriptionSize || 0) + 33.9 + 'px',
          }"
        >
          {{ commentators.people[2]?.description }}
        </text>
      </g>
    </svg>
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
        gsap.to('#Right_Namebar', { transform: 'translateX(0)', duration: 1.25 });
        gsap.to('#Left_Namebar', { transform: 'translateX(0)', duration: 1.25 });
      }
      else {
        gsap.to('#Right_Namebar', { transform: 'translateX(700px)', duration: 1.25 });
        gsap.to('#Left_Namebar', { transform: 'translateX(-970px)', duration: 1.25 });
      }
    }
});

// Hide the namebars if the graphic is off
onMounted(() => {
  if (!props.preview) {
    if (!channels[0]?.commentators) {
      gsap.to('#Right_Namebar', { transform: 'translateX(700px)', duration: 0 });
      gsap.to('#Left_Namebar', { transform: 'translateX(-970px)', duration: 0 });
    }
  }
})
</script>

<style scoped>
.cls-1 {
  fill: #d31245;
}

.cls-2 {
  letter-spacing: -0.02em;
}

.cls-3 {
  letter-spacing: 0em;
}

.cls-4 {
  letter-spacing: -0.02em;
}

.cls-5 {
  letter-spacing: -0.02em;
}

.cls-6,
.cls-7,
.cls-8 {
  fill: #fff;
}

.cls-9 {
  letter-spacing: 0em;
}

.cls-10 {
  letter-spacing: -0.02em;
}

.cls-11 {
  opacity: 0.8;
}

.cls-12 {
  letter-spacing: -0.01em;
}

.cls-13 {
  fill: #262823;
}

.cls-14 {
  letter-spacing: 0em;
}

.cls-15 {
  letter-spacing: -0.01em;
}

.cls-16 {
  letter-spacing: -0.02em;
}

.cls-17 {
  letter-spacing: -0.02em;
}

.cls-7 {
  font-size: 22px;
}

.cls-7,
.cls-8 {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-style: italic;
}

.cls-18 {
  letter-spacing: -0.03em;
}

.cls-19 {
  fill: #00549c;
}

.cls-20 {
  letter-spacing: 0.01em;
}

.cls-8 {
  font-size: 33.9px;
}

.cls-21 {
  letter-spacing: -0.01em;
}

.cls-22 {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-size: 45px;
  font-weight: 300;
}
</style>
