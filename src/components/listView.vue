<template>
<div id="listView">
    <div v-for="v in $store.state.ts" :key="v" class="line">
        <vs-button type="border" class="small-btn" @click="player.jumpTo(v.from)">{{$t2s(v.from)}}</vs-button>
        <div style="width: 1rem; height:1rem; "></div>
        -
        <div style="width: 1rem; height:1rem; "></div>
        <vs-button type="border" class="small-btn" @click="player.jumpTo(v.to)">{{$t2s(v.to)}}</vs-button>
    </div>
</div>
</template>

<script>
export default {
    props: {
        player: null
    }
}
</script>

<style>
.line {
    display: flex;
    margin: 0.5rem 0;
    align-items: center;
}

.small-btn {
    width: 140px !important
}
</style>
