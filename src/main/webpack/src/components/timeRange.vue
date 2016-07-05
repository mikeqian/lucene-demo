<template>
    <div class="form-group">
        <div class="form-group">
            <input v-model="timeMin" type="text" class="form-control">
        </div>

        <div class="form-group">
            <input v-model="timeMax" type="text" class="form-control">
        </div>
    </div>
</template>
<script type="text/babel">
    import util from '../libs/util';

    export default {
        props: {
            timeMin: {
                type: String,
                default: util.getMinTimeStr()
            },
            timeMax: {
                type: String,
                default: util.getMaxTimeStr()
            }
        },
        created () {
        },

        ready(){

        },

        watch: {},
        computed: {},
        methods: {}
    }
</script>


<style>

</style>