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
        "name": "Export as ffmpeg command",
        method: (items, vm) => {
            console.log(items, vm, 3)
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
                return `${vm.videoURL}${vm.$t2s(item.from)} ${vm.$t2s(item.to)} ${item.cat ? item.cat : ""} ${formatName(item.name)}`
            }
            vm.showPopup("Rushia Button batch", items.map(e => genBat(e)).join("\n"))
        }
    },
    {
        "name": "Export as Raw json",
        method: (items) => {
            return items
        }
    }, {
        "name": "Save to pasteboard",
        method: (_, vm) => {
            vm.inDev()
        }
    },
]