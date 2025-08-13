<template>
  <div>
    <UCard>
      <template #header>
        <p class="text-2xl">
          Preview
        </p>
      </template>
      <iframe src="http://localhost:3000/display/?preview=locator&dev=1" >

      </iframe>
    </UCard>
  </div>
</template>

<script lang="ts" setup>

</script>

<style>
iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: none;
}
</style>