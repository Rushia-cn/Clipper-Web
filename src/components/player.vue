<template>
<div>
    <youtube :videoId="videoId" @ready="videoReady" :player-vars="playerVars" :player-width="playerWidth" :player-height="playerHeight" ref="ytb"></youtube>
</div>
</template>

<script>
export default {
    props: ['videoId'],
    data() {
        return {
            curTime: 0,
            playerVars: {},
            playerHeight: '540',
            playerWidth: '990'
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
            this.curTime = Number(this.ytb.getCurrentTime()).toFixed(3)
            const that = this
            setTimeout(function () {
                requestAnimationFrame(that.updateCurrentTime)
            }, 50);
        },
        jumpTo(sec) {
            if (typeof sec !== 'number') sec = this.$s2t(sec)
            if (sec === -1) return
            this.ytb.seekTo(sec)
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
