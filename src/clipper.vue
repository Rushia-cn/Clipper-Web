<template>
<div>
    <main id="app">
        <youtube :videoId="videoId" @ready="videoReady" :player-vars="playerVars" :player-width="playerWidth" :player-height="playerHeight" ref="ytb"></youtube>
        <div id="upper">
            <div id="controller">
                <vs-tooltip color="primary" text="Rewind for 1.5s">
                    <vs-button size="small" type="flat" @click="forward(-1.5)" title="Rewind for 1.5s">
                        <Rewind :size="20" />
                    </vs-button>
                </vs-tooltip>
                <vs-tooltip color="primary" text="Create a new interval with current time">
                    <vs-button size="large" class="large-btn" type="filled" @click="newTS" title="Add a new interval">{{ formatedCurTime }}</vs-button>
                </vs-tooltip>
                <vs-tooltip color="primary" text="Rewind for 1.5s">
                    <vs-button size="small" type="flat" @click="forward(1.5)" title="Forward for 1.5s">
                        <FastForward :size="20" />
                    </vs-button>
                </vs-tooltip>
            </div>
            <div id="id-input" title="Press enter to apply">
                <a style="wrap: none">Youtube Video ID or URL (Press enter)</a>
                <vs-input id="ip-input-comp" v-model="updateVid" @keydown.enter="videoId = $getId(updateVid)" />
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
                        <vs-button type="border" class="control-button" v-if="v.to == null" @click="setTo(v)">Set "To" value</vs-button>
                        <controlButton v-if="!(v.to == null)" v-model="v.to" :jump="!v.looping" />
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
    <vs-popup :title="popup.title" :active.sync="popup.show">
        <vs-textarea v-model="popup.content" height="500px"></vs-textarea>
    </vs-popup>
</div>
</template>

<script>
import controlButton from '@/controlButton'
import exportConfig from '@/export.js'

import Rewind from 'vue-material-design-icons/Rewind.vue'
import FastForward from 'vue-material-design-icons/FastForward.vue'
import TrashCanOutline from 'vue-material-design-icons/TrashCanOutline.vue'

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
            updateVid: null,
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
        this.updateVid = this.videoId
    },
    computed: {
        videoURL() {
            return this.ytb.playerInfo.videoUrl
        },
        formatedCurTime() {
            return this.$t2s(this.curTime)
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
        showPopup(title, content) {
            this.popup = {
                show: true,
                title,
                content
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
                    "No timestamps made yet, start by adding a new item with clip button and finish it with 'addTo' button (and names / category)",
                    7000
                )
                return
            } else {
                this.pause()
                func(this.items, this)
            }
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
        setTo(item) {
            if (item.from >= this.curTime) {
                this.alert("'To' must be greater than 'From'")
                return
            }
            item.to = this.curTime
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
textarea {
    height: 100%;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    margin: 0.9rem auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    max-width: 990px;
}

#upper {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-items: center;
    margin: 0.4rem 0;
}

#id-input {
    display: flex;
    margin: 0.4rem;
    align-items: center;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    flex-grow: 2;
}

#id-input a {
    font-size: 0.3rem;
    position: absolute;
    z-index: 100;
    top: -1rem;
}

#id-input div {
    width: 100%;
}

#ip-input-comp {
    cursor: pointer !important;
    width: 100% !important;
}

#submit {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 0.4rem;
    flex-grow: 1;
}

#controller {
    display: flex;
    align-items: center;
}

#list-view {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding-left: 1.6rem;
}

main {
    box-sizing: border-box;
    max-width: 50rem;
    padding: 0.4rem;
}

footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 0.8rem;
    max-width: 990px;
}

a {
    color: #333;
}

.title {
    margin: 0.2rem 0.4rem;
}

.edit-line {
    display: flex;
    align-items: center;
    margin: 0.125rem 0;
    justify-content: space-between;
}

.edit-line a {
    margin: 0 0.4rem;
}

.prompt-input {
    width: 100% !important;
}

.vs-con-dropdown {
    width: 100%;
}

.vs-con-input {
    width: 100% !important;
}

.con-vs-alert {
    background: rgba(var(--vs-danger), 0.85) !important;
}

.vs-alert {
    color: #fff;
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
