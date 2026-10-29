<template>
  <div id="twobooth">
    <svg
      class="fullscreen"
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1920 1080"
    >
      <g id="Right_Namebar">
        <rect
          id="Outer_Shadow"
          class="cls-5"
          x="1256.07"
          y="869.17"
          width="663.93"
          height="122.8"
        />
        <rect
          id="Outer_Blue"
          class="cls-10"
          x="1246.77"
          y="863.15"
          width="195.77"
          height="135.65"
        />
        <rect
          id="Outer_Red"
          class="cls-1"
          x="1724.23"
          y="863.15"
          width="195.77"
          height="135.65"
        />
        <rect
          id="Namebar_White"
          class="cls-2"
          x="1264.38"
          y="875.84"
          width="655.62"
          height="109.3"
        />
        <rect
          id="Namebar_Black"
          class="cls-7"
          x="1264.38"
          y="930.86"
          width="655.62"
          height="54.28"
        />
        <text
          id="Main_Text"
          class="cls-12"
          transform="translate(1430.569 915.7588)"
          text-anchor="middle"
          x="160"
          :style="{
            fill: commentators.people[1]?.nameColor || 'black',
            fontSize: (commentators.people[1]?.nameSize || 0) + 45 + 'px',
          }"
        >
          {{ commentators.people[1]?.name }}
        </text>
        <text
          id="SubText"
          class="cls-3"
          transform="translate(1508.5698 966.521)"
          text-anchor="middle"
          x="80"
          :style="{
            fill: commentators.people[1]?.descriptionColor || 'white',
            fontSize: (commentators.people[1]?.descriptionSize || 0) + 33.9 + 'px'
          }"
        >
          {{ commentators.people[1]?.description }}
        </text>
      </g>
      <g id="Left_Namebar">
        <rect
          id="Outer_Shadow-2"
          data-name="Outer_Shadow"
          class="cls-5"
          x="-1.23"
          y="868.74"
          width="661.52"
          height="124.09"
        />
        <rect
          id="Outer_Blue-2"
          data-name="Outer_Blue"
          class="cls-10"
          x="476.76"
          y="863.15"
          width="195.77"
          height="135.65"
        />
        <rect
          id="Outer_red"
          class="cls-1"
          x="-1.23"
          y="863.15"
          width="195.77"
          height="135.65"
        />
        <rect
          id="Namebar_White-2"
          data-name="Namebar_White"
          class="cls-2"
          x="-1.23"
          y="875.84"
          width="655.62"
          height="109.3"
        />
        <rect
          id="Namebar_Black-2"
          data-name="Namebar_Black"
          class="cls-7"
          x="-1.23"
          y="930.86"
          width="655.62"
          height="54.28"
        />
        <text
          id="Main_Text-2"
          data-name="Main_Text"
          class="cls-12"
          transform="translate(183.39 915.76)"
          text-anchor="middle"
          x="145"
          :style="{
            fill: commentators.people[0]?.nameColor || 'black',
            fontSize: (commentators.people[0]?.nameSize || 0) + 45 + 'px',
          }"
        >
          {{ commentators.people[0]?.name }}
        </text>
        <text x="35" id="Subtext" class="cls-3" transform="translate(288.99 966.52)" text-anchor="middle"
          :style="{
            fill: commentators.people[0]?.descriptionColor || 'white',
            fontSize: (commentators.people[0]?.descriptionSize || 0) + 33.9 + 'px'
          }"
        >
          {{ commentators.people[0]?.description }}
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
        gsap.to('#Left_Namebar', { transform: 'translateX(-700px)', duration: 1.25 });
      }
    }
});

// Hide the namebars if the graphic is off
onMounted(() => {
  if (!props.preview) {
    if (!channels[0]?.commentators) {
      gsap.to('#Right_Namebar', { transform: 'translateX(700px)', duration: 0 });
      gsap.to('#Left_Namebar', { transform: 'translateX(-700px)', duration: 0 });
    }
  }
})
</script>

<style scoped>
#twobooth {
  transition: none;
  opacity: 1 !important;
}

.cls-1 {
  fill: #d31245;
}

.cls-2,
.cls-3 {
  fill: #fff;
}

.cls-4 {
  letter-spacing: 0em;
}

.cls-5 {
  opacity: 0.8;
}

.cls-6 {
  letter-spacing: -0.01em;
}

.cls-7 {
  fill: #262823;
}

.cls-8 {
  letter-spacing: 0em;
}

.cls-9 {
  letter-spacing: -0.02em;
}

.cls-10 {
  fill: #00549c;
}

.cls-11 {
  letter-spacing: 0.02em;
}

.cls-3 {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-style: italic;
}

.cls-12 {
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-weight: 300;
}
</style>
