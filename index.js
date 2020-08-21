import Vue from 'vue'
import VueYouTubeEmbed from 'vue-youtube-embed'
import {
    YouTubePlayer
} from 'vue-youtube-embed'
import App from './App.vue'

Vue.use(VueYouTubeEmbed)
Vue.prototype.$player = YouTubePlayer

new Vue({
    render: h => h(App),
}).$mount('#app')