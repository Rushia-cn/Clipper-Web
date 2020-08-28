<template>
<div>
    <main id="app">
        <youtube :videoId="videoId" @ready="videoReady" :player-vars="playerVars" :player-width="playerWidth" :player-height="playerHeight" ref="ytb"></youtube>
        <div id="upper">
            <div id="controller">
                <vs-button size="small" type="flat" @click="forward(-1.5)" title="Rewind for 1.5s">
                    <Rewind :size="20" />
                </vs-button>
                <vs-button size="large" class="large-btn" type="filled" @click="addFrom" title="Add a new interval">From</vs-button>
                <a style="cursor:pointer" @click="startDialog">{{
            formatedCurTime
          }}</a>
                <vs-button size="large" class="large-btn" type="filled" @click="addTo" title="Set last.to with current time">To</vs-button>
                <vs-button size="small" type="flat" @click="forward(1.5)" title="Forward for 1.5s">
                    <FastForward :size="20" />
                </vs-button>
            </div>
            <div id="id-input" title="Press enter to apply">
                <a style="wrap: none">Youtube Video ID or URL (Press enter)</a>
                <vs-input v-model="updateVid" @keydown.enter="videoId = $getId(updateVid)" />
            </div>
            <div id="submit">
                <vs-dropdown @mousedown="callExportMethod(exportConfig[0].method)">
                    <vs-button type="filled" size="large" title="Upload Directly" style="width: 100%">{{ exportConfig[0].name }}</vs-button>
                    <vs-dropdown-menu>
                        <vs-dropdown-item v-for="(v, i) in exportConfig.slice(1)" @click="callExportMethod(v.method)" :key="i">
                            {{ v.name }}
                        </vs-dropdown-item>
                    </vs-dropdown-menu>
                </vs-dropdown>
            </div>
        </div>
        <div id="list-view">
            <div v-for="(v, i) in items" :key="i" class="line-wrapper">
                <a class="title line" @click="changeThisName(i)">{{
            $formatName(v.name)
          }}</a>
                <div class="line">
                    <div class="ts">
                        <controlButton v-model="v.from" />
                        <a style="width: 105px; height:1rem" title="Clip Length">
                            {{ v.to - v.from > 0 ? $t2s(v.to - v.from) : 'N/A' }}
                        </a>
                        <controlButton v-model="v.to" />
                    </div>
                    Category:
                    <vs-input title="Category: For Buttons that follows RushiaButton's standard" v-model="v.cat">
                    </vs-input>
                    <div class="ts">
                        <vs-switch type="border" v-model="v.looping" :disabled="!completed(v) || v.to < v.from" @click="loop(v)" :vs-value="v">
                            <span slot="on">Loop On</span>
                            <span slot="off">Loop Off</span>
                        </vs-switch>
                        <vs-button @click="items.pop(i)" type="flat">
                            <TrashCanOutline :size="20" />
                        </vs-button>
                    </div>
                </div>
            </div>
        </div>
        <footer>
            <vs-alert :active.sync="showAlert" color="danger">
                {{ alertContent }}
            </vs-alert>
        </footer>
    </main>
    <vs-prompt :active.sync="dialog" title="Jump To" @cancel="updateCurTime = ''" @accept="jumpTo($s2t(updateCurTime))">
        <div class="prompt">
            <vs-input label="TimeStamp (HH:MM:SS[.xxx])" v-model="updateCurTime" />
        </div>
    </vs-prompt>
    <vs-prompt :active.sync="updatingName" title="Set name" @cancel="afterChangingName(false)" @accept="afterChangingName(true)" v-if="updatingName">
        <div v-for="(k, i) in Object.keys(tempName)" :key="i" class="edit-line">
            <a>{{ k }}:</a>
            <vs-input v-model="tempName[k]" class="prompt-input"></vs-input>
        </div>
    </vs-prompt>
    <vs-popup class="holamundo" :title="popup.title" :active.sync="popup.show">
        <pre v-highlightjs="popup.content" v-if="popup.isJson"><code class="json"></code></pre>
        <a v-if="!popup.isJson">{{ popup.content }}</a>
    </vs-popup>
</div>
</template>

<script>
import controlButton from '@/components/controlButton'
import Rewind from 'vue-material-design-icons/Rewind.vue'
import FastForward from 'vue-material-design-icons/FastForward.vue'
import TrashCanOutline from 'vue-material-design-icons/TrashCanOutline.vue'
import exportConfig from './export.js'
export default {
    data() {
        return {
            videoId: '1y8iL0v2o-g',
            ytb: null,
            alertContent: null,
            showAlert: false,
            curTime: 0,
            playerVars: {},
            playerHeight: '540',
            playerWidth: '990',
            items: [],
            dialog: false,
            updateCurTime: null,
            updateVid: this.videoId,
            updatingName: false,
            changingItemIndex: null,
            tempName: {
                en: null,
                zh: null,
                jp: null
            },
            popup: {
                show: false,
                isJson: false,
                title: null,
                content: null
            }
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
        },
        metaInputed() {
            return this.items.some(item => item.cat || item.name)
        },
        copyOfChangingItem() {
            return JSON.parse(JSON.stringify(this.changingItem))
        },
        exportConfig() {
            return exportConfig
        }
    },
    methods: {
        showPopup(title, content, isJson = false) {
            this.popup = {
                show: true,
                title,
                content,
                isJson
            }
        },
        afterPopup() {
            this.popup = {
                show: false,
                isJson: false,
                title: null,
                content: null
            }
        },
        callExportMethod(func) {
            if (this.items.length === 0) {
                this.alert(
                    "'items' is empty, start by adding a new item with `From` button and finish it with 'To' button (and names / category)",
                    7000
                )
                return
            } else func(this.items, this)
        },
        alert(content, timeout = 3000) {
            this.alertContent = content
            this.showAlert = true
            const that = this
            setTimeout(function () {
                that.showAlert = false
                that.alertContent = null
            }, timeout)
        },
        inDev() {
            this.alert('Sorry, this function is still in development')
        },
        pause() {
            this.ytb.pauseVideo()
        },
        videoReady(event) {
            this.ytb = event.target
            this.updateCurrentTime()
        },
        updateCurrentTime() {
            this.curTime = Number(this.ytb.getCurrentTime())
            if (this.looping.state && this.curTime >= this.looping.item.to)
                this.jumpTo(this.looping.item.from)
            const that = this
            setTimeout(function () {
                requestAnimationFrame(that.updateCurrentTime)
            }, 50)
        },
        newTS() {
            this.items.push({
                from: this.curTime,
                to: null,
                looping: false,
                cat: null,
                name: {
                    en: '',
                    zh: '',
                    jp: ''
                }
            })
            this.$forceUpdate()
        },
        completed(ts) {
            return ts.from !== null && ts.to !== null
        },
        addFrom() {
            if (this.lastComplete) this.newTS()
            else this.alert("Use 'To' to complete this clip first!")
        },
        addTo() {
            const last = this.last
            if (this.lastComplete) {
                this.alert("Create one with 'From' button first")
                return
            } else if (last.from >= this.curTime) {
                this.alert("'To' must be greater than 'From'")
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
                this.alert('Complete this TimeStamp')
            }
            this.jumpTo(item.from)
            this.items.filter(v => item !== v).map(v => (v.looping = false))
        },
        startDialog() {
            this.dialog = !this.dialog
            this.updateCurTime = this.formatedCurTime
            this.pause()
        },
        changeThisName(index) {
            this.updatingName = true
            this.changingItemIndex = index
            this.tempName = JSON.parse(
                JSON.stringify(this.items[this.changingItemIndex].name)
            )
        },
        afterChangingName(acceptted) {
            if (acceptted) this.items[this.changingItemIndex].name = this.tempName
            this.updatingName = false
            this.tempName = null
        }
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
    margin: 20px auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    max-width: 990px;
}

#upper {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
}

#id-input {
    display: flex;
    margin: 10px;
    align-items: center;
    flex-direction: column;
    align-items: flex-start;
}

#id-input a {
    font-size: 8px;
}

#submit {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 10px;
    flex-grow: 2;
}

#controller {
    display: flex;
    align-items: center;
    flex-grow: 1;
}

#list-view {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-left: 40px;
}

main {
    box-sizing: border-box;
    max-width: 1200px;
    padding: 10px;
}

footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 20px;
    max-width: 990px;
}

a {
    color: #333;
}

.title {
    margin: 5px 10px;
}

.edit-line {
    display: flex;
    align-items: center;
    margin: 3px 0;
    justify-content: space-between;
}

.edit-line a {
    margin: 0 10px;
}

.prompt-input {
    width: 100% !important;
}

.vs-con-dropdown {
    cursor: pointer !important;
    width: 100%;
}

.con-vs-alert {
    background: rgba(var(--vs-danger), 0.85) !important;
}

.vs-alert {
    color: #fff;
}

.btn-drop {
    border-radius: 0px 5px 5px 0px;
    border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.btnx {
    margin-left: 10px !important;
    border-radius: 5px 0px 0px 5px;
}

.large-btn {
    margin: 1rem;
    width: 10rem;
}

.material-design-icon {
    height: 12px;
    width: 12px;
    position: relative;
    bottom: -1px;
}

.line {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
}

.arrow {
    bottom: 2.5px;
}

.ts {
    display: flex;
    align-items: center;
}
</style>
