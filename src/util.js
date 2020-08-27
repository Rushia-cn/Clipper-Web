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
    if (v === null || v === undefined) return "N/A"
    if (v <= 0) return "00:00:00.000"
    const ms = v % 1
    const s = Math.round(v - ms)
    const date = new Date(0)
    date.setSeconds(s)
    date.setMilliseconds(ms * 1000)
    return date.toISOString().substr(11, 12)
}

export {
    TStoNumber,
    numberToTs
}