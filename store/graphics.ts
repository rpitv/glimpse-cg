import { defineStore } from 'pinia'

export const useGraphicsStore = defineStore('graphics', () => {
  const selectedGraphic = ref({
    component: null as Component | null,
    name: '',
    id: null as string | null
  });

  function setGraphic(graphic: { component: Component | null; name: string, id: string | null }) {
    selectedGraphic.value = graphic;
  }

  return { setGraphic, selectedGraphic };
});
