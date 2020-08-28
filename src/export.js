export default [
    {
        name: "Upload",
        method: (_, vm) => {
            vm.inDev()
        }
    },
    {
        "name": "Send to Telegram",
        method: (_, vm) => {
            vm.inDev()
        }
    }, {
        "name": "Send to Github",
        method: (_, vm) => {
            vm.inDev()
        }
    }, {
        "name": "Export as youtube-dl command",
        method: (items, vm) => {
            const vid = vm.videoId
            let cmd = `youtube-dl -f bestaudio "${vm.videoURL}" -x --audio-format mp3 --audio-quality 192k -o "${vid}.%(ext)s" \n && `
            function genCmd (item) {
                const from = vm.$t2s(item.from)
                const to = item.to ? vm.$t2s(item.to) : null
                return `ffmpeg -y -i "${vid}.mp3" -ss ${from} ${to ? `-to ${to}` : ""} -af loudnorm=I=-23:TP=-2:LRA=11 ${vid}-${from}${to ? `-${to}` : ""}.mp3`
            }
            cmd += items.map(e => genCmd(e)).join("\n && ")
            vm.showPopup("Youtube-dl command", cmd)
        }
    },
    {
        "name": "Export as Rushia Button batch",
        method: (items, vm) => {
            function formatName (name) {
                const formatted = Object.entries(name).map(e => {
                    if (!e[1]) return
                    return `${e[0]}:"${e[1]}"`
                }).filter(e => !!e).join(" ")
                return formatted ? formatted : ""
            }
            function genBat (item) {
                if (!(item.from !== null && item.to !== null)) {
                    return
                }
                return `${vm.videoURL} ${vm.$t2s(item.from)} ${vm.$t2s(item.to)} ${item.cat ? item.cat : ""} ${formatName(item.name)}`
            }
            vm.showPopup("Rushia Button batch", items.map(e => genBat(e)).join("\n"))
        }
    },
    {
        "name": "Export as Raw json",
        method: (items, vm) => {
            vm.showPopup("Raw json", JSON.stringify(items.map(e => {
                delete e.looping
                return e
            }), null, 4))
        }
    }, {
        "name": "Save to pasteboard",
        method: (_, vm) => {
            vm.inDev()
        }
    },
]