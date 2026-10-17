<template>
  <p>
    The scorebug has its own dedicated customization panel.
    <ULink
      class="green-link"
      :view-transition="true"
      to="/scoreboard"
    >Click here</ULink>
    to navigate to the page.
    <div class="flex items-center gap-2">
    <USwitch
        v-model="replicants.channels[0]!.sog"
        size="xl"
        label="Display SOG"
    />
    <Info class="text-xl">SOG will automatically be turned off if the scorebug is turned off.</Info>
    <UKbd :class="`${inputFocus.isInputFocused.value ? 'opacity-20' : 'opacity-100'} transition-all`">
        G
    </UKbd>
    </div>
  </p>
</template>

<script lang="ts" setup>
const replicants = await useReplicants();
const inputFocus = useInputFocus();

defineShortcuts({
  'g': () => {
    if (!inputFocus.isInputFocused.value) replicants.channels[0]!.sog = !replicants.channels[0]!.sog;
  },
})
</script>

<style scoped>
.green-link {
  color: #39d873; /* green-600 */
}
</style>
