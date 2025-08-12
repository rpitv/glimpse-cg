<template>
  <TombstoneBuilder :style="tombstone">
    <div id="ESPNCopyrightText" :style="copyrightTextContainer">
      <span :style="copyrightText">
        {{ copyright!.text || (`© ${new Date().getFullYear()} ESPN, Inc. All Rights Reserved`) }}
      </span>
    </div>
  </TombstoneBuilder>
</template>

<script setup lang="ts">
import type {CSSProperties} from "vue";
import TombstoneBuilder from "../tomestone/TombstoneBuilder.vue";
import type { LowerThird } from "~/types/replicants";

const lowerThird = useReplicant<LowerThird>("lowerThird");
const copyright = computed(() => lowerThird.value!.copyright);
const leftOffset = 5;
const bottomOffset = 6;
const textPadding = 1;

const tombstone = computed((): CSSProperties => {
  return {
    left: (copyright!.value.offsetX + leftOffset) + "vw",
    bottom: (copyright!.value.offsetY + bottomOffset) + "vh",
    maxWidth: (100 - (textPadding + copyright!.value.offsetX) * 2 - leftOffset) + "vw",
  }
});
const copyrightTextContainer = computed((): CSSProperties => {
  return {
    padding: textPadding + "vw",
  }
});
const copyrightText = computed((): CSSProperties => {
  return {
    color: copyright!.value.textColor,
    fontSize: copyright!.value.textSize + 3.8 + "vh",
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
