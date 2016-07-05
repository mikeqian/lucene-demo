<template>
    <content>
        <div style="padding: 20px 20px 20px 50px" class="div1">
            <label class="control-label">资源中心自营重新推送队列:</label>
            <div class="row">
                <div class="col-sm-2">
                    <input type="text" class="form-control" placeholder="pushSelfKey" v-model="pushSelfKey">
                </div>
                <div class="col-sm-2">
                    <button type="button" class="btn btn-primary" @click='pushSelfClick' style="margin-left:50px;">推送
                    </button>
                </div>
            </div>
        </div>

        <div style="padding: 20px 20px 20px 50px" calss="div2">
            <label class="control-label">资源中心补发数据:</label>
            <div class="row">
                <div class="col-sm-2">
                    <input type="text" class="form-control" placeholder="compensateUrl" v-model="compensateUrl">
                </div>
                <div class="col-sm-2">
                    <datepicker
                            :value.sync="compensateDay" :format="'yyyy-MM-dd'">
                    </datepicker>
                </div>
                <div class="col-sm-2">
                    <select class="form-control" v-model="compensateChannel">
                        <option value="1">自营</option>
                        <option value="2">联营</option>
                        <option value="3">撮合</option>
                    </select>
                    </span>
                </div>
                <div class="col-sm-2">
                    <button type="button" class="btn btn-primary" @click='compensateClick' style="margin-left:50px;">
                        推送
                    </button>
                </div>
            </div>
        </div>

        <div style="padding: 20px 20px 20px 50px" calss="div3">
            <label class="control-label">重推撮合请求（批量）:</label>
            <div class="row">
                <div class="col-sm-2">
                    <datepicker
                            :value.sync="timeMatch" :format="'yyyy-MM-dd'">
                    </datepicker>
                </div>
                <div class="col-sm-2">
                    <button type="button" class="btn btn-primary" @click='batchResendMatchClick'
                            style="margin-left:50px;">推送
                    </button>
                </div>
            </div>
        </div>
        <div style="padding: 20px 20px 20px 50px" calss="div4">
            <label class="control-label">重推联营请求（批量）:</label>
            <div class="row">
                <div class="col-sm-2">
                    <input v-model="timeUnionMin" type="text" class="form-control">
                </div>
                <div class="col-sm-2">
                    <input v-model="timeUnionMax" type="text" class="form-control">
                </div>
                <div class="col-sm-2">
                    <button type="button" class="btn btn-primary" @click='batchResendUnionClick'
                            style="margin-left:50px;">推送
                    </button>
                </div>
            </div>

        </div>
        <div style="padding: 20px 20px 20px 50px" calss="div5">
            <label class="control-label">重推自营请求（批量）:</label>
            <div class="row">
                <div class="col-sm-2">
                    <input v-model="" type="text" readonly="readonly" class="form-control"
                           placeholder="点击按钮重推">
                </div>
                <div class="col-sm-2">
                    <button type="button" class="btn btn-primary" @click='batchResendSelfClick'
                            style="margin-left:50px;">推送
                    </button>
                </div>
            </div>

        </div>
    </content>
</template>

<script type="text/babel">
    import {datepicker} from "vue-strap"
    import util from "../libs/util"
    import moment  from "moment"
    export default {
        data(){
            return {
                pushSelfKey: "",
                timeMin: util.getMinTimeStr(),
                timeMax: util.getMaxTimeStr(),
                mIds: [],

                timeUnionMin: util.getMinTimeStr(),
                timeUnionMax: util.getMaxTimeStr(),
                timeMatch: moment().format("YYYY-MM-DD"),
                compensateUrl: "",
                compensateDay: util.getShortDateStr(),
                compensateChannel: 1,
            }
        },
        methods: {
            doJobProxy(id){
                let url = "/sales.engine.monitor.api/proxy_rc/internal/job/index?id=" + id;
                util.ajaxGet(url).done(data=> {
                    alert(data);
                })
            },
            doJob(id){
                let url = "/sales.engine.monitor.api/internal/job/index?id=" + id;
                util.ajaxGet(url).done(data=> {
                    alert(data);
                })
            },
            pushSelfClick(){
                util.postProxy("internal/job/pushAllSelfPkid", JSON.stringify({key: this.pushSelfKey})).done(data=> {
                    alert(JSON.stringify(data))
                })
            },
            compensateClick(){
                let param = {
                    channel: this.compensateChannel,
                    host: this.compensateUrl,
                    day: this.compensateDay
                }
                util.postProxy("internal/job/compensate", JSON.stringify(param)).done(data=> {
                    alert(JSON.stringify(data))
                })
            },
            batchResendMatchClick(){
                let param = {
                    startTime: util.getJavaDate(this.timeMatch + " 00:00:01"),
                    endTime: util.getJavaDate(this.timeMatch + " 23:59:59")
                }
                util.postLocal("internal/resend/batchResendMatchRequest", JSON.stringify(param)).done(data=> {
                    alert(JSON.stringify(data))
                })
            },
            batchResendSelfClick(){
                util.postQesProxy("internal/self/sync","").done(data=> {
                    alert(JSON.stringify(data))
                })
            },
            batchResendUnionClick(){
                let param = {
                    startTime: util.getJavaDate(this.timeUnionMin),
                    endTime: util.getJavaDate(this.timeUnionMax)
                }
                util.postProxy("internal/query/productcategory", JSON.stringify(param)).done(data=> {
                    let rows = data.productCategoryList || []
                    rows.forEach((item)=> {
                        let productId = item.productId;
                        this.mIds.push(productId.substring(1))
                    })
//                    alert(this.mIds)
                    let p = {
                        ids: this.mIds
                    };
                    util.postLocal("internal/product/sync", JSON.stringify(p)).done(data=> {
                        alert("重推" + data)
                    })
                })
            }
        },
        components: {
            datepicker
        }
    }
</script>
