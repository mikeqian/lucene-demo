<template>
    <!-- 全局header -->
    <nv-top></nv-top>

    <section id="page">
        <!-- 首页列表 -->

        <div class="row TextCenter" style="padding-left: 100px;">
            <div class="col-xs-9">
                <h1>{{entity.Title}}</h1>
                <div style="margin-bottom: 30px;"></div>
                <div class="highlight">
                    {{{showHtml}}}
                </div>
            </div>

        </div>


    </section>
</template>

<script type="text/babel">

    import {dealHtml} from "../filters"

    var cnName = localStorage.getItem("cnName") || "spider"

    export default {
        data (){
            return {
                entity: {}
            }
        },
        computed: {
            showHtml(){
                return this.entity.Content ?dealHtml(this.entity.Content):""
            }
        },
        route: {
            data (transition){
                try {
                    this.url = decodeURIComponent(transition.to.params.url);
                    let params = {
                        Url:this.url,
                        cnName: cnName
                    };
                    $.post(util.api("spider/get"),params).done(data=> {
                        this.entity = data.Rows[0];
                        this.Count = data.Count;
                    }, error=>console.log(error))
                }
                catch (e) {
                    console.log(e)
                }
            }
        },
        components: {
            "nvTop": require('../components/top.vue'),
        }
    }
</script>
<style >

</style>