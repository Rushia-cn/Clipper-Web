import Vue from 'vue'
import VueYouTubeEmbed from 'vue-youtube-embed'
import {
    getIdFromURL
} from 'vue-youtube-embed'
import App from './App.vue'

Vue.use(VueYouTubeEmbed)
Vue.prototype.$getId = getIdFromURL

new Vue({
    render: h => h(App),
}).$mount('#app')