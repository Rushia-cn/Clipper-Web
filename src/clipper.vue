<template>
<main id="app">
    <youtube :videoId="videoId" @ready="videoReady" :player-vars="playerVars" :player-width="playerWidth" :player-height="playerHeight" ref="ytb"></youtube>
    <div id="controller">
        <vs-button size="small" type="flat" @click="forward(-1.5)">
            <Rewind :size="20" />
        </vs-button>
        <vs-button size="large" class="large-btn" type="filled" @click="addFrom">From</vs-button>
        <a style="cursor:pointer" @click="startDialog">{{formatedCurTime}}</a>
        <vs-button size="large" class="large-btn" type="filled" @click="addTo">To</vs-button>
        <vs-button size="small" type="flat" @click="forward(1.5)">
            <FastForward :size="20" />
        </vs-button>
        <vs-prompt :active.sync="dialog" title="Jump To">
            <div class="prompt">
                <vs-input label="TimeStamp (HH:MM:SS[.xxx])" v-model="updateCurTime" />
            </div>
        </vs-prompt>
    </div>
    <div id="list-view">
        <div v-for="(v, i) in items" :key="i" class="line">
            <div class="ts">
                <controlButton v-model="v.from" />
                <div style="width: 1rem; height:1rem; "></div>
                -
                <div style="width: 1rem; height:1rem; "></div>
                <controlButton v-model="v.to" />
            </div>
            <div class="ts">
                <vs-switch type="border" v-model="v.looping" :disabled="!completed(v)" @click="loop(v)" :vs-value="v">
                    <span slot="on">Loop On</span>
                    <span slot="off">Loop Off</span>
                </vs-switch>
                <vs-button @click="items.pop(i)" type="flat">
                    <TrashCanOutline :size="20" />
                </vs-button>
            </div>
        </div>
    </div>
</main>
</template>

<script>
import controlButton from '@/components/controlButton'
import Rewind from 'vue-material-design-icons/Rewind.vue';
import FastForward from 'vue-material-design-icons/FastForward.vue';
import TrashCanOutline from 'vue-material-design-icons/TrashCanOutline.vue'
export default {
    data() {
        return {
            videoId: "Exk34o-MMIE",
            ytb: null,
            curTime: 0,
            playerVars: {},
            playerHeight: '540',
            playerWidth: '990',
            items: [{
                from: 60,
                to: 120,
                looping: false
            }],
            dialog: false,
            updateCurTime: null
        }
    },
    mounted() {
        this.player = this.$refs.player
    },
    computed: {
        formatedCurTime() {
            return this.$t2s(this.curTime)
        },
        last() {
            return this.items[this.items.length - 1]
        },
        lastComplete() {
            if (this.items.length === 0) return true
            const last = this.last
            return last.from !== null && last.to !== null
        },
        looping() {
            return {
                state: this.items.some(item => item.looping),
                item: this.items.find(item => item.looping)
            }
        }
    },
    methods: {
        pause() {
            this.ytb.pauseVideo()
        },
        videoReady(event) {
            this.ytb = event.target
            this.updateCurrentTime()
        },
        updateCurrentTime() {
            this.curTime = Number(this.ytb.getCurrentTime())
            if (this.looping.state && this.curTime >= this.looping.item.to) this.jumpTo(this.looping.item.from)
            const that = this
            setTimeout(function () {
                requestAnimationFrame(that.updateCurrentTime)
            }, 50);
        },
        newTS() {
            this.items.push({
                from: this.curTime,
                to: null,
                looping: false
            })
        },
        completed(ts) {
            return ts.from && ts.to
        },
        addFrom() {
            if (this.lastComplete)
                this.newTS()
        },
        addTo() {
            const last = this.last
            if (this.lastComplete) {
                alert("Create one with from first")
                return
            } else if (last.from >= this.curTime) {
                alert("To must be greater than From")
                return
            }
            last.to = this.curTime
        },
        jumpTo(sec) {
            if (typeof sec !== 'number') sec = this.$s2t(sec)
            if (sec === -1) return
            this.ytb.seekTo(sec)
        },
        forward(sec) {
            this.jumpTo(this.curTime + sec)
        },
        loop(item) {
            if (item.looping) return
            if (!this.completed(item)) {
                throw 'Complete this TimeStamp'
            }
            this.jumpTo(item.from)
            this.items.filter(v => item !== v).map(v => v.looping = false)
        },
        startDialog() {
            this.dialog = !this.dialog
            this.updateCurTime = this.formatedCurTime
            this.pause()
        },
    },
    components: {
        Rewind,
        FastForward,
        TrashCanOutline,
        controlButton
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    margin: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
    max-width: 990px
}

main {
    box-sizing: border-box;
    max-width: 1200px;
    padding: 10px
}

.large-btn {
    margin: 1rem;
    width: 10rem
}

.material-design-icon {
    height: 12px;
    width: 12px;
    position: relative;
    bottom: -1px
}

#list-view {
    width: 100%;
    display: flex;
    flex-direction: column
}

.line {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap
}

.ts {
    display: flex;
    align-items: center
}
</style>
