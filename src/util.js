import Vue from './App.vue'

function TStoNumber(ts) {
    try {
        const hms = ts.split(':')
        let time = 0
        for (const i of hms) {
            time *= 60
            time += Number(i)
            if (isNaN(time)) return -1
        }
        return time
    } catch (e) {
        return -1
    }
}

function numberToTs(v) {
    if (v === 0) return "00:00:00.000"
    if (!v) return "N/A"
    const ms = v % 1
    const s = Math.round(v - ms)
    const date = new Date(0)
    date.setSeconds(s)
    date.setMilliseconds(ms * 1000)
    return date.toISOString().substr(11, 12)
}

const items = {
    ts: [],
    getLast() {
        return items.ts[items.ts.length - 1]
    },
    lastComplete() {
        if (items.ts.length === 0) return true
        const last = items.getLast()
        console.log(last)
        return last.from !== null && last.to !== null
    },
    newTS(curTime) {
        items.ts.push({
            from: curTime,
            to: null
        })
    },
    addFrom(curTime) {
        Vue.$forceUpdate()
        if (items.lastComplete())
            items.newTS(curTime)
    },
    addTo(curTime) {
        const last = items.getLast()
        if (items.lastComplete()) {
            alert("Create one with from first")
            return
        } else if (last.from >= items.curTime) {
            alert("To must be greater than From")
            return
        }
        last.to = curTime
    }
}

export {
    TStoNumber,
    numberToTs,
    items
}