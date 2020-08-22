<template>
    <div id="control-panel">
        <div id="urlInput">
            <input v-model="videoURL" placeholder="Youtube Video Url" />
            <button type="submit" @click="updateUrl">GO</button>
        </div>
        <youtube :videoId="videoId" @ready="videoReady" ref="ytb"></youtube>
        <div id="jump-group">
            <button type="button" @click="jump(-3)"> -3s </button>
            <button type="button" @click="jump(-1)"> -1s </button>
            <input v-model="inpTime" @keydown.enter="jumpTo(inpTime)">
            {{formatTime(curTime)}}
            <div v-if="looping">
                Looping [{{formatTime(loopTS[0])}} - {{formatTime(loopTS[1])}}]
                <button type="button" @click="clearLoop">Clear Loop</button>
            </div>
            <button type="button" @click="jump(1)"> +1s </button>
            <button type="button" @click="jump(3)"> +3s </button>
        </div>
        <div id="timestamp-control-group">
            <button type="button" @click="addFrom">From</button>
            <button type="button" @click="addTo">To</button>
        </div>
        <div id="timestamp-group" v-for="(ts, i) in timeStamps" :key="i">
            <button type="button" @click="jumpTo(ts.from)"> {{ formatTime(ts.from) }} </button>
            <button type="button" @click="jumpTo(ts.to)"> {{ formatTime(ts.to) }} </button>
            <button type="button" @click="loop(ts.from, ts.to)">Loop</button>
            <button type="button" @click="timeStamps.pop(i)">X</button>
        </div>
        <div id="metaInput">
            Name:
            <input id="nameInput" placeholder="zh:歪比巴伯 en:FooBar"/>
            Category: 
            <select>
                <option v-for="(option, index) in categories" value="option" :key="index">{{index}}</option>
            </select>
        </div>
        <button type="submit">Submit</button>
    </div>
</template>
<script>
export default {
    data(){
        return {
            videoId: "LWzM5Ak5yOQ",
            videoURL: "",
            categories: {
                "moe": {
                    zh: "awsl",
                    en: "moe"
                }
            },
            playerVar:{ rel: 0 },
            inpTime: 0,
            curTime: 0,
            timeStamps: [],
            looping: false,
            loopTS: []
        }
    },
    computed: {
        last(){
            return this.timeStamps[this.timeStamps.length - 1]
        },
        lastComplete(){
            if (this.timeStamps.length === 0) return true
            const last = this.last
            return last.from !== null && last.to !== null
        },
    },
    methods:{
        loop(from, to){
            if (!from || !to) {
                alert("Complete the timelapese")
                return
            }
            this.looping = true
            this.loopTS[0] = this.parseTime(from)
            this.loopTS[1] = this.parseTime(to)
            this.jump(this.jumpTo[0])
        },
        clearLoop(){
            this.looping = false
            this.loopTS = []
        },
        formatTime(v){
            if (v === null) return "N/A"
            v = v.toString()
            if (v === "0") return 0
            const splited = v.split(".")
            const date = new Date(0)
            date.setSeconds(Number(splited[0]))
            date.setMilliseconds(Number(splited[1]))
            return date.toISOString().substr(11, 12)
        },
        videoReady(event){
            this.ytb = event.target
            this.updateCurrentTime()
        },
        jump(sec){
            let duration = this.ytb.getDuration()
            let targetTime = Number(this.curTime) + sec
            if (targetTime < 0) targetTime = 0
            if (targetTime > duration) targetTime = duration
            this.ytb.seekTo(targetTime)
        },
        jumpTo(sec){
            if (typeof sec === "string")
                sec = this.parseTime(sec)
            if (sec === -1) return
            this.ytb.seekTo(sec)
        },
        parseTime(str){
            try{
                const hms = str.split(':')
                let time = 0
                for (const i of hms) {
                    time *= 60
                    time += Number(i)
                    if (isNaN(time)) return -1
                }
            return time
            }catch(e){
                return -1
            }
        },
        updateCurrentTime() {
            this.curTime = Number(this.ytb.getCurrentTime()).toFixed(3)
            if (this.curTime >= this.loopTS[1]) this.jumpTo(this.loopTS[0].toString())
            const that = this
            setTimeout(function(){
                requestAnimationFrame(that.updateCurrentTime)
            }, 50);
        },
        addFrom(){
            if (this.lastComplete)
                this.newTS()
            this.last.from = this.curTime
        },
        addTo(){
            if (this.lastComplete){
                alert("Create one with from first")
                return
            } else if (this.last.from >= this.curTime){
                alert("To must be greater than From")
                return
            }
            this.last.to = this.curTime
        },
        newTS(){
            this.timeStamps.push({
                from: null,
                to: null
            })
        },
        updateUrl(){
            this.videoId = this.$youtube.getIdFromURL(this.videoURL)
        }
    }
}
</script>
<style>
#control-panel {
    display: flex;
    flex-direction: column;
    align-items: center
}
</style>