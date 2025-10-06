import { defineStore } from 'pinia'

export const useGraphicsStore = defineStore('graphics', () => {
  const selectedGraphic = ref({
    component: null as Component | null,
    name: ''
  });

  function setGraphic(graphic: { component: Component | null; name: string }) {
    selectedGraphic.value = graphic;
  }

  return { setGraphic, selectedGraphic };
});
