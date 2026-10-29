<template>
  <div>
    <svg
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1920 1080"
      class="fullscreen"
    >
      <rect
        class="cls-6"
        x="438.77"
        y="874.91"
        width="947.82"
        height="126.91"
      />
      <rect
        class="cls-14"
        x="1200.76"
        y="869.32"
        width="195.77"
        height="139.48"
      />
      <rect
        class="cls-1"
        x="423.77"
        y="869.32"
        width="195.77"
        height="139.48"
      />
      <rect
        class="cls-3"
        x="438.77"
        y="883.27"
        width="939.37"
        height="111.58"
      />
      <text class="cls-16" transform="translate(504.3 950.92)">
        <tspan :style="copyrightStyle" text-anchor="middle" x="405">{{ copyright.text || `@ ${new Date().getFullYear()} ECAC Hockey, SNY, ESPN, RPI TV` }}</tspan>
      </text>
    </svg>
  </div>
</template>

<script lang="ts" setup>
import type { CSSProperties } from 'vue';

const replicants = await useReplicants();
const copyright = replicants.lowerThird.copyright;

const copyrightStyle = computed((): CSSProperties => {
  return {
    fill: copyright.textColor || '#000',
    fontSize: copyright.textSize + 1 + 'em',
  };
});

</script>

<style>
.fullscreen {
  position: absolute;
  height: 100vh;
  width: 100vw;
}

.cls-1 {
  fill: #d31245;
}

.cls-2 {
  letter-spacing: 0em;
}

.cls-3 {
  fill: #fff;
}

.cls-4 {
  letter-spacing: 0em;
}

.cls-5 {
  letter-spacing: -0.01em;
}

.cls-6 {
  opacity: 0.8;
}

.cls-7 {
  letter-spacing: -0.05em;
}

.cls-8 {
  letter-spacing: -0.02em;
}

.cls-9 {
  letter-spacing: -0.03em;
}

.cls-10 {
  letter-spacing: -0.01em;
}

.cls-11 {
  letter-spacing: 0em;
}

.cls-12 {
  letter-spacing: 0em;
}

.cls-13 {
  letter-spacing: 0.04em;
}

.cls-14 {
  fill: #00549c;
}

.cls-15 {
  letter-spacing: 0em;
}

.cls-16 {
  /* font-family: FranklinGothic-Demi, "Franklin Gothic Demi"; */
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
  font-size: 45px;
  font-weight: 300;
}
</style>
