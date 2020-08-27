import Vue from 'vue'
import clipper from './clipper.vue'
import VueYouTubeEmbed from 'vue-youtube-embed'
import {
  getIdFromURL
} from 'vue-youtube-embed'

import {
  vsButton,
  vsSelect,
  vsInput,
  vsPopup,
  vsPrompt,
  vsSwitch,
  vsIcon
} from 'vuesax'

import 'vuesax/dist/vuesax.css'

import {
  TStoNumber,
  numberToTs,
  items
} from '@/util.js'

Vue.config.productionTip = false
Vue.prototype.$getId = getIdFromURL
Vue.prototype.$s2t = TStoNumber // str to timestamp
Vue.prototype.$t2s = numberToTs // timestamp to str
Vue.prototype.$items = items

Vue.use(VueYouTubeEmbed)
Vue.use(vsButton)
Vue.use(vsSelect)
Vue.use(vsPopup)
Vue.use(vsInput)
Vue.use(vsPrompt)
Vue.use(vsSwitch)
Vue.use(vsIcon)

new Vue({
  render: h => h(clipper),
}).$mount('#app')