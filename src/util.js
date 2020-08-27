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
    if (v != 0 & !v) return "N/A"
    if (v <= 0) return "00:00:00.000"
    const ms = v % 1
    const s = Math.round(v - ms)
    const date = new Date(0)
    date.setSeconds(s)
    date.setMilliseconds(ms * 1000)
    return date.toISOString().substr(11, 12)
}

function formatName(v){
    if (typeof (v) !== 'object') return "N/A"
    if (Object.values(v).every(v => !v)) return "No name (click to set)"
    const values = Object.values(v)
    if (!values) return "No name"
    else return values.join(" / ") 
}

const namePattern = /([a-zA-Z]{2})\w*?:\w*?"(.*?)"/
function parseName(v) {
    if (typeof v !== "string" || namePattern.test(v)) return {}
    const splitted = v.split(" ")
    const ret = {}
    splitted.forEach(function (e) {
        console.log(e)
        const matched = e.match(namePattern)
        ret[matched[1]] = matched[2]
    })
    return ret
}

export {
    TStoNumber,
    numberToTs,
    formatName,
    parseName,
    namePattern
}