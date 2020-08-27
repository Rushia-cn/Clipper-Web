<template>
<div id="controller">
    <vs-button size="small" type="flat">
        <Rewind :size="20" />
    </vs-button>
    <vs-button size="large" class="large-btn" type="filled" @click="$store.commit('addFrom', player.curTime)">From</vs-button>
    <a style="cursor:pointer" @click="startDialog">{{formatedCurTime}}</a>
    <vs-button size="large" class="large-btn" type="filled" @click="$store.commit('addTo', player.curTime)">To</vs-button>
    <vs-button size="small" type="flat">
        <FastForward :size="20" />
    </vs-button>
    <vs-prompt :active.sync="dialog" title="Jump To">
        <div class="prompt">
            <vs-input label="TimeStamp (HH:MM:SS[.xxx])" v-model="updateCurTime" />
        </div>
    </vs-prompt>
</div>
</template>

<script>
import Rewind from 'vue-material-design-icons/Rewind.vue';
import FastForward from 'vue-material-design-icons/FastForward.vue';
export default {
    props: ["player"],
    components: {
        Rewind,
        FastForward
    },
    data() {
        return {
            dialog: false,
            updateCurTime: null,
            updatingCurTime: false,
        }
    },
    computed: {
        formatedCurTime() {
            if (!this.player) return "N/A"
            return this.$t2s(this.player.curTime)
        }
    },
    methods: {
        print(item) {
            console.log(item)
        },
        startDialog() {
            this.dialog = !this.dialog
            this.updateCurTime = this.formatedCurTime
            this.player.pause()
        }
    },
}
</script>

<style>
#controller {
    display: flex;
    align-items: center;
    justify-content: center
}

.material-design-icon {
    height: 12px;
    width: 12px;
    position: relative;
    bottom: -1px
}

.prompt {
    padding: 10px;
    padding-bottom: 0px;
}

.large-btn {
    margin: 1rem;
    width: 10rem
}

.vs-icon {
    display: none
}
</style>
