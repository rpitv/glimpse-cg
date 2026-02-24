import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faTrash,
  faMinus,
  faPlus,
  faPenToSquare,
  faPause,
  faPlay,
  faInfoCircle,
  faMagnifyingGlass,
  faRotateRight,
  faExplosion,
} from '@fortawesome/free-solid-svg-icons';

// Prevent FA from injecting CSS automatically
config.autoAddCss = false;

// Add only the specific icons we use
library.add(faMinus, faPlus, faPenToSquare, faPause, faPlay, faInfoCircle, faMagnifyingGlass, faTrash, faRotateRight, faExplosion);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon);
});
