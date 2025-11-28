<template>
  <div>
    <ImageView id="images" />
    <ScoreboardView id="scorebug" />
    <CommentatorsView id="commentators" />
    <CreditsView id="credits" />
    <div v-if="configuration!.style === 'espn'">
      <ESPNProduced id="espn-produced" />
      <ESPNBanner id="espn-banner" />
      <ESPNTombstone id="espn-tombstone" />
    </div>
    <LocatorView id="locator" />
    <GoToBreakView id="break-scoreboard" />
    <PlayerBioView id="PlayerBio" />
    <BottomTextBar id="bottom-text-bar" />
    <CopyrightView id="copyright" />
    <BugView />
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
import BottomTextBar from './LowerThirdViews/BottomTextBar.vue';

const replicants = await useReplicants();
const configuration = replicants.configuration;
</script>

<style scoped lang="scss">
.hide {
  opacity: 0;
  transition: 1s;
}

.show {
  opacity: 1;
  transition: 1s;
}
</style>
