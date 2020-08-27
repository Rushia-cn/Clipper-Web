<template>
<div id="app">
    <main>
        <Player :videoId="'DWcJFNfaw9c'" ref="player" />
        <controller :player="player" />
        <listView :player="player"></listView>
    </main>
</div>
</template>

<script>
import Player from '@/components/player'
import listView from '@/components/listView'
import controller from '@/components/controller'
export default {
    name: 'App',
    data() {
        return {
            player: null,
        }
    },
    mounted() {
        this.player = this.$refs.player
    },
    computed: {
        curTime() {
            return this.player.curTime
        },
        items() {
            return this.$items
        }
    },
    methods: {},
    components: {
        Player,
        listView,
        controller
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
    margin: 0 auto
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
</style>
