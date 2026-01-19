import { defineStore } from 'pinia';

export const useGraphicsStore = defineStore('graphics', () => {
  const selectedGraphic = ref({
    component: null as Component | null,
    name: '',
    index: -1,
  });
  const customizationFocused = ref(false);
  const previewFocused = ref(false);

  function setGraphic(graphic: { component: Component | null; name: string; index: number }) {
    selectedGraphic.value = graphic;
  }

  return { setGraphic, selectedGraphic };
});
