<template>
  <TombstoneBuilder :style="tombstone">
    <div
      id="ESPNCopyrightText"
      :style="copyrightTextContainer"
    >
      <span :style="copyrightText">
        {{ copyright!.text || (`© ${new Date().getFullYear()} ECAC Hockey Conference, All Rights Reserved`) }}
      </span>
    </div>
  </TombstoneBuilder>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue';
import TombstoneBuilder from '../tomestone/TombstoneBuilder.vue';

const replicants = await useReplicants();
const copyright = replicants.lowerThird.copyright;
const leftOffset = 5;
const bottomOffset = 6;
const textPadding = 0.5;

const tombstone = computed((): CSSProperties => {
  return {
    left: (copyright.offsetX + leftOffset) + 'vw',
    bottom: (copyright.offsetY + bottomOffset) + 'vh',
    maxWidth: (100 - (textPadding + copyright.offsetX) * 2 - leftOffset) + 'vw',
    width: 'auto',
  };
});
const copyrightTextContainer = computed((): CSSProperties => {
  return {
    padding: textPadding + 'vw',
  };
});
const copyrightText = computed((): CSSProperties => {
  return {
    color: copyright.textColor || '#3f403b',
    fontSize: copyright.textSize + 3 + 'vh',
  };
});
</script>

<style scoped lang="scss">
@font-face {
  font-family: "swiss721_bold";
  src: url('~/assets/espn/Swiss721Bold.ttf')
}

#ESPNCopyrightText {
  display: flex;
  align-items: center;
  font-family: "swiss721_bold";
}
</style>
