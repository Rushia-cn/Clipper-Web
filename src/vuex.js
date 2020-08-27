import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        ts: [],
        player: null
    },
    getters: {
        last: state => {
            return state.ts[state.ts.length - 1]
        },
        lastComplete: (state, getters) => {
            if (state.ts.length === 0) return true
            const last = getters.last
            return last.from !== null && last.to !== null
        }
    },
    mutations: {
        addFrom: (state, curTime) => {
            if (state.getters.lastComplete)
                state.items.newTS(curTime)
        },
        addTo: (state, curTime) => {
            const last = state.getters.last
            if (state.getters.lastComplete) {
                alert("Create one with from first")
                return
            } else if (last.from >= curTime) {
                alert("To must be greater than From")
                return
            }
            last.to = curTime
        },
        deleteTS: (state, index) => {
            state.ts.pop(index)
        },
        setPlayer: (state, player) => {
            if (!state.player) state.player = player
        }
    },
    actions: {
        addFrom: (state, curTime) => {
            if (state.getters.lastComplete)
                state.items.newTS(curTime)
        },
        addTo: (state, curTime) => {
            const last = state.getters.last
            if (state.getters.lastComplete) {
                alert("Create one with from first")
                return
            } else if (last.from >= curTime) {
                alert("To must be greater than From")
                return
            }
            last.to = curTime
        },
        deleteTS: (state, index) => {
            state.ts.pop(index)
        },
        setPlayer: (state, player) => {
            if (!state.player) state.player = player
        }
    }
})