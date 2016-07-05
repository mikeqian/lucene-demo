<template>
    <content>
        <iframe id="ifSearch" src="" frameborder="0" width="100%" style="height: auto;min-height: 650px;"></iframe>
    </content>
</template>

<script type="text/babel">
    document.title = "search";
    import {key, configFactory} from "../../libs/config"
    export default {
        data(){
            return {
                url: ""
            }
        },
        methods: {
            getEnvironment(){
                let key = localStorage.getItem("configKey")
                if (key == null) {
                    util.postLocalSync ("internal/config/index").done(data=> {
                        let config = data || "test"
                        localStorage.setItem("configKey", config)
                        key = localStorage.getItem("configKey")
                        this.url = configFactory[key].search_url;
                    })
                }
                else {
                    this.url = configFactory[key].search_url;
                }
                console.log(this.url)
            }
        },
        ready(){
            $("#ifSearch").prop("src", this.url)
        },
        route: {
            data (transition){
                this.getEnvironment();
                transition.next();
            }
        },
        components: {}
    }
</script>