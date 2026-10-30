<template>
  <div>
    <ImageView id="images" />
    <ScoreboardView id="scorebug" :class="`${preview ? (currentGraphic === 'scorebug' ? 'super-show' : 'super-hide') : ''}`" />
    <div v-if="configuration!.style === 'espn'">
      <ESPNProduced id="espn-produced" />
      <ESPNBanner id="espn-banner" :class="`${preview ? (currentGraphic === 'scorebug' ? 'super-show' : 'super-hide') : ''}`"/>
      <ESPNTombstone id="espn-tombstone" :class="`${preview ? (currentGraphic === 'standings' ? 'super-show' : 'super-hide') : ''}`"/>
    </div>
    <CommentatorsView id="commentators" :class="`${preview ? (currentGraphic === 'commentators' ? 'super-show' : 'super-hide') : ''}`"/>
    <CreditsView id="credits" :class="`${preview ? (currentGraphic === 'credits' ? 'super-show' : 'super-hide') : ''}`"/>
    <LocatorView id="locator" :class="`${preview ? (currentGraphic === 'locator' ? 'super-show' : 'super-hide') : ''}`"/>
    <GoToBreakView id="break-scoreboard" :class="`${preview ? (currentGraphic === 'gotobreak' ? 'super-show' : 'super-hide') : ''}`"/>
    <PlayerBioView id="PlayerBio" :class="`${preview ? (currentGraphic === 'playerbio' ? 'super-show' : 'super-hide') : ''}`" />
    <OutOfTownView id="OutOfTown" :class="`${preview ? (currentGraphic === 'outoftown' ? 'super-show' : 'super-hide') : ''}`" />
    <CopyrightView id="copyright" :class="`${preview ? (currentGraphic === 'copyright' ? 'super-show' : 'super-hide') : ''}`"/>
    <BugView id="bug" :class="`${preview ? (currentGraphic === 'bug' ? 'super-show' : 'super-hide') : ''}`"/>
  </div>
</template>

<script setup lang="ts">
import ImageView from './CustomGraphicView.vue';
import ESPNProduced from './styles/espn/lower-third/Produced.vue';
import ESPNBanner from './styles/espn/Banner.vue';
import BugView from './LowerThirdViews/BugView.vue';
import CommentatorsView from './LowerThirdViews/CommentatorsView.vue';
import CopyrightView from './LowerThirdViews/CopyrightView.vue';
import CreditsView from './FullscreenViews/CreditView.vue';
import LocatorView from './LowerThirdViews/LocatorView.vue';
import GoToBreakView from './LowerThirdViews/GoToBreakView.vue';
import ScoreboardView from './ScoreboardView.vue';
import PlayerBioView from './LowerThirdViews/PlayerBioView.vue';
import ESPNTombstone from './styles/espn/tomestone/Tombstone.vue';
import { useLocalStorage } from '@vueuse/core';
import OutOfTownView from './FullscreenViews/OutOfTownView.vue';

const replicants = await useReplicants();
const configuration = replicants.configuration;
const currentGraphic = useLocalStorage('currentGraphic', '');
const route = useRoute();
const preview = ref(route.query.preview || false);

</script>

<style lang="scss">
.hide {
  opacity: 0;
  transition: 1s;
}

.show {
  opacity: 1;
  transition: 1s;
}

.super-hide {
  opacity: 0 !important;
  transition: none !important;
}

.super-show {
  opacity: 1 !important;
  transition: none !important;
}

.fullscreen {
  position: absolute;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
}
</style>
