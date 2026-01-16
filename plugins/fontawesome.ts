import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Import only the FontAwesome icons actually used in the app to minimize bundle size
import {
  faMinus,
  faPlus,
  faPenToSquare,
  faPause,
  faPlay,
} from '@fortawesome/pro-solid-svg-icons';

// Prevent FA from injecting CSS automatically
config.autoAddCss = false;

// Add only the specific icons we use
library.add(faMinus, faPlus, faPenToSquare, faPause, faPlay);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon);
});
