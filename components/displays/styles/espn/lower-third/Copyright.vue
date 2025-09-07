<template>
  <TombstoneBuilder :style="tombstone">
    <div id="ESPNCopyrightText" :style="copyrightTextContainer">
      <span :style="copyrightText">
        {{ copyright!.text || (`© ${new Date().getFullYear()} ECAC Hockey Conference, All Rights Reserved`) }}
      </span>
    </div>
  </TombstoneBuilder>
</template>

<script setup lang="ts">
import type {CSSProperties} from "vue";
import TombstoneBuilder from "../tomestone/TombstoneBuilder.vue";
import type { LowerThird } from "~/types/replicants";

const lowerThird = await useReplicant<LowerThird>("lowerThird");
const copyright = computed(() => lowerThird.value!.copyright);
const leftOffset = 5;
const bottomOffset = 6;
const textPadding = 0.5;

const tombstone = computed((): CSSProperties => {
  return {
    left: (copyright!.value.offsetX + leftOffset) + "vw",
    bottom: (copyright!.value.offsetY + bottomOffset) + "vh",
    maxWidth: (100 - (textPadding + copyright!.value.offsetX) * 2 - leftOffset) + "vw",
    width: "auto",
  }
});
const copyrightTextContainer = computed((): CSSProperties => {
  return {
    padding: textPadding + "vw",
  }
});
const copyrightText = computed((): CSSProperties => {
  return {
    color: copyright!.value.textColor || "#3f403b",
    fontSize: copyright!.value.textSize + 3 + "vh",
  }
});

</script>

<style scoped lang="scss">
@font-face {
  font-family: "swiss721_bold";
  src: url('~/assets/espn/Swiss721Bold.ttf')
}

#ESPNCopyrightText {
  font-family: "swiss721_bold";
}
</style>
