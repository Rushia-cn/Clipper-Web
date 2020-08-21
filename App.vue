<template>
    <div id="app">
        <control></control>
    </div>
</template>
<script>
import control from './control';
export default {
    components: {
        control
    }
}
</script>
<style>
#app {
    display: flex;
    flex-direction: column;
    align-items: center
}
</style>