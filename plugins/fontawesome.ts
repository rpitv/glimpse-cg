import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Import Pro styles
import { fas } from '@fortawesome/pro-solid-svg-icons'
import { far } from '@fortawesome/pro-regular-svg-icons'
import { fal } from '@fortawesome/pro-light-svg-icons'
import { fat } from '@fortawesome/pro-thin-svg-icons'
import { fad } from '@fortawesome/pro-duotone-svg-icons'

// Prevent FA from injecting CSS automatically
config.autoAddCss = false

// Add your chosen sets
library.add(fas, far, fal, fat, fad)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})