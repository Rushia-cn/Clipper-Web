<template>
    <div id="control-panel">
        <youtube :videoId="videoId" @ready="videoReady" ref="ytb"></youtube>
        <div id="jump-group">
            <button type="button" @click="jump(-3)"> -3s </button>
            <button type="button" @click="jump(-1)"> -1s </button>
            <input v-model="inpTime" @keydown.enter="jumpTo(inpTime)">
            {{curTime}}
            <button type="button" @click="jump(1)"> +1s </button>
            <button type="button" @click="jump(3)"> +3s </button>
        </div>
        <div id="timestamp-control-group">
            <button type="button" @click="addFrom">From</button>
            <button type="button" @click="addTo">To</button>
        </div>
        <div id="timestamp-group" v-for="(ts, i) in timeStamps" :key="i">
            <button type="button" @click="jumpTo(ts.from)"> {{ (ts.from !== null) ? ts.from : "N/A" }} </button>
            <button type="button" @click="jumpTo(ts.to)"> {{ (ts.to !== null) ? ts.to : "N/A" }} </button>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            videoId: "LWzM5Ak5yOQ",
            playerVar:{ rel: 0 },
            inpTime: 0,
            curTime: 0,
            timeStamps: []
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
            const parsed = this.parseTime(sec)
            if (parsed === -1) return
            this.ytb.seekTo(parsed)
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
            this.curTime = Number(this.ytb.getCurrentTime()).toFixed(2)
            requestAnimationFrame(this.updateCurrentTime)
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
            } else if (this.last.from > this.curTime){
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