<template>
    <div class="login-box" style="min-height: 565px;" id="divLogin">
        <div class="login-logo" style="color: white">
            <b>后台</b>
        </div>
    </div>
</template>

<script type="text/babel">
    import util from '../libs/util'
    export default {
        data (){
            return {
                code: "",
                name: "",
                password: ""
            }
        },
        methods: {

        },
        route: {
            data (transition){
                    setTimeout(()=> $("#divTopContainer").show(), 0)
                    this.$route.router.go({name: 'dashboard'});
            }
        },
        ready(){
        }
    }
</script>

<style>
    @import "../assets/css/main.css";
</style>
