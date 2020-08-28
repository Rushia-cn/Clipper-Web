<template>
<vs-button class="control-button" @mousedown="move" @mousewheel.prevent="wheel" type="border" title="Drag or scroll to fine-tune">
    {{ $t2s(changingValue) }}
</vs-button>
</template>

<script>
export default {
    props: {
        value: Number,
        precision: {
            type: Number,
            default: 0.03
        },
        jump: {
            type: Boolean,
            default: true
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
            changingValue: this.value,
            lastDown: null
        }
    },
    watch: {
        value(newValue) {
            this.changedValue = newValue
            this.changingValue = newValue
        }
    },
    computed: {
        active() {
            return this.value !== null
        }
    },
    methods: {
        wheel(e) {
            if (!this.active) return
            this.changingValue -= e.deltaY / 100
            if (this.changingValue < 0) this.changingValue = 0
            this.commit()
        },
        move(e) {
            if (!this.active) return
            this.holding = true
            this.xy.x = e.clientX
            this.xy.y = e.clientY
            this.lastDown = Date.now()
            window.addEventListener('mousemove', this.mouseMove)
            window.addEventListener('mouseup', this.mouseUp)
        },
        mouseMove(e) {
            const dx = e.clientX - this.xy.x
            var num = this.precision * dx + this.changedValue
            if (num < 0) num = 0
            this.changingValue = num
        },
        mouseUp() {
            window.removeEventListener('mousemove', this.mouseMove)
            window.removeEventListener('mouseup', this.mouseUp)
            if (!this.jump && Math.abs(Date.now() - this.lastDown) < 100) {
                this.$parent.jumpTo(this.changedValue - 0.5)
            } else this.commit(this.jump)
        },
        commit(jump = true) {
            this.changedValue = this.changingValue
            this.$emit('input', this.changingValue)
            if (jump) this.$parent.jumpTo(this.changedValue)
        }
    }
}
</script>

<style>
.control-button {
    margin: 3px 10px;
    width: 10rem;
    transition: all ease 0.3s;
}
</style>
