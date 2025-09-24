<template>
  <div :class="(channels![channelIndex].bottomTextBar && !route.query.preview) || preview ? 'show' : 'hide'">
    <div class="container">
      <div :class="channels![channelIndex].bottomGrayText || preview ? 'show' : 'hide'">
        <span class="abs top-text" :style="greyTextStyle">{{ bottomTextBar!.greyText.text }}</span>
      </div>
      <div>
        <img class="abs" :src="redBar" :style="redBarStyle">
        <span class="abs red-text" :style="redTextStyle">{{ bottomTextBar!.redText.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import redBar from "~/assets/rpitv-modern/red_bar.png";
import {computed, type CSSProperties} from "vue";
import type { Channels, LowerThird } from "~/types/replicants";


const route = useRoute();
const replicants = await useReplicants();
let channelIndex = ref(0);
if (route.query.channel)
  channelIndex.value = parseInt(route.query.channel as string);

const preview = ref(route.query.preview === "bottomtextbar" || false);

const channels = replicants.channels;
const lowerThird = replicants.lowerThird;
const bottomTextBar = lowerThird.bottomTextBar;

const greyTextStyle = computed((): CSSProperties => {
  return {
    opacity: bottomTextBar!.greyText.text?.length === 0 ? 0 : 1,
    background: bottomTextBar!.greyText.bgColor || "#54585AFF",
    top: "auto",
    marginLeft: bottomTextBar!.greyText.offsetX + "vw",
    paddingLeft: "4vw",
    marginRight: "4vw",
    marginBottom: bottomTextBar!.greyText.offsetY + "vw",
    left: "42.6vh",
    bottom: "15vh",
    width: "70.2vw",
    padding: "0.5vh",
    fontSize: 3 + bottomTextBar!.greyText.textSize + "vh",
    textAlign: bottomTextBar!.greyText.alignment,
    color: bottomTextBar!.greyText.textColor,
  }
});

const redBarStyle = computed((): CSSProperties => {
    return {
        marginLeft: bottomTextBar!.redText.offsetX + "vw",
        marginBottom: bottomTextBar!.redText.offsetY + "vw",
    }
});

const redTextStyle = computed((): CSSProperties => {
    // auto adjust sizing if enabled
    if (bottomTextBar!.redText.autoResize) {
        switch (bottomTextBar!.redText.text.trim().split("\n").length) {
            case 1:
                bottomTextBar!.redText.textSize = 3
                break;
            case 2:
                bottomTextBar!.redText.textSize = 0
                break;
            default:
                break
        }
    }

    return {
        whiteSpace: "pre-wrap",
        top: "auto",
        marginLeft: 4 + bottomTextBar!.redText.offsetX + "vw",
        marginRight: "4vw",
        marginBottom: bottomTextBar!.redText.offsetY + "vw",
        left: "20vw",
        bottom: "6vh",
        width: "64.5vw",
        fontSize: 3.3 + bottomTextBar!.redText.textSize + "vh",
        textAlign: bottomTextBar!.redText.alignment,
        color: bottomTextBar!.redText.textColor,
    }
});
</script>

<style scoped lang="scss">
@font-face {
    font-family: "Malgun Gothic Bold";
    src: url("../../../assets/rpitv-modern/MalgunGothicBold.ttf") format('truetype');
}

.container {
    font-family: "Malgun Gothic Bold";
}

.abs {
  position: absolute;
  top: 0;
  left: 0;
}

.top-text:before, .top-text:after {
  content: "\00a0\00a0\00a0\00a0"
}

img {
  width: 100vw;
  height: 100vh;
}
</style>
