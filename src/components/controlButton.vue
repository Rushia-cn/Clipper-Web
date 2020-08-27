<template>
<vs-button class="control-button" @mousedown="move" @mousewheel.prevent="wheel" type="border">
    {{$t2s(changingValue)}}
    <div class="inner-button"></div>
</vs-button>
</template>

<script>
export default {
    props: {
        value: Number,
        precision: {
            type: Number,
            default: 0.03
        }
    },
    data() {
        return {
            holding: false,
            xy: {
                x: null,
                y: null
            },
            changedValue: this.value,
            changingValue: this.value
        }
    },
    methods: {
        wheel(e) {
            this.changingValue -= e.deltaY / 100
            this.commit()
        },
        move(e) {
            this.holding = true
            this.xy.x = e.clientX
            this.xy.y = e.clientY
            window.addEventListener("mousemove", this.mouseMove)
            console.log("called")

            document.onmouseup = () => {
                window.removeEventListener("mousemove", this.mouseMove);
                this.commit()
            };
        },
        mouseMove(e) {
            const dx = e.clientX - this.xy.x
            var num = this.precision * dx + this.changedValue
            if (num < 0) num = 0
            this.changingValue = num
        },
        commit() {
            this.changedValue = this.changingValue
            this.$parent.jumpTo(this.changedValue)
        }
    }
}
</script>
