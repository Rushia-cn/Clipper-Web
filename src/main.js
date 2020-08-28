import Vue from 'vue'
import clipper from './clipper.vue'
import VueYouTubeEmbed from 'vue-youtube-embed'
import {
  getIdFromURL
} from 'vue-youtube-embed'
import VueHighlightJS from 'vue-highlightjs'

import {
  vsButton,
  vsSelect,
  vsInput,
  vsPopup,
  vsPrompt,
  vsSwitch,
  vsIcon,
  vsDropDown,
  vsAlert,
} from 'vuesax'

import 'vuesax/dist/vuesax.css'
import 'material-icons/iconfont/material-icons.css';

import {
  TStoNumber,
  numberToTs,
  formatName,
  parseName,
  namePattern
} from '@/util.js'

Vue.config.productionTip = false
Vue.prototype.$getId = getIdFromURL
Vue.prototype.$s2t = TStoNumber // str to timestamp
Vue.prototype.$t2s = numberToTs // timestamp to str
Vue.prototype.$formatName = formatName
Vue.prototype.$parseName = parseName
Vue.prototype.$namePattern = namePattern

Vue.use(VueYouTubeEmbed)
Vue.use(vsButton)
Vue.use(vsSelect)
Vue.use(vsPopup)
Vue.use(vsInput)
Vue.use(vsPrompt)
Vue.use(vsSwitch)
Vue.use(vsIcon)
Vue.use(vsDropDown)
Vue.use(vsAlert)
Vue.use(VueHighlightJS)

new Vue({
  render: h => h(clipper),
}).$mount('#app')