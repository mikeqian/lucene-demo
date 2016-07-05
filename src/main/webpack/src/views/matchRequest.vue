<template>
    <content>
        <form class="form-inline" role="form" method="post">
            <label class="control-label">资源单Id:</label>
            <div class="form-group">
                <input v-model="zydId" type="text" class="form-control" placeholder="zydId">
            </div>

            <label class="control-label">appNo:</label>
            <div class="form-group">
                <input v-model="appNo" type="text" class="form-control" placeholder="appNo">
            </div>

            <label class="control-label">时间参数</label>
            <div class="form-group">
                <div class="form-group">
                    <input v-model="timeMin" type="text" class="form-control">
                </div>

                <div class="form-group">
                    <input v-model="timeMax" type="text" class="form-control">
                </div>
            </div>

            <button type="button" @click="queryClick" class="btn btn-primary" style="margin-left:15px;">Query
            </button>
        </form>
        <div class="row  TextCenter ">
            <div class="col-xs-12" id="divSpiderBox">
                <div class="box">

                    <div class="box-body table-responsive no-padding">
                        <table class="table table-hover">
                            <tbody>
                            <tr>
                                <th>操作类型</th>
                                <th>spotId</th>
                                <th>appNo</th>
                                <th>资源单Id</th>
                                <th>创建时间</th>
                            </tr>
                            <tr v-for=" row in BaseList" @click="Index=$index"
                                :class="{actived:Index==$index}">
                                <td>{{row.operationType|OperationType}}</td>
                                <td>{{row.spotId}}</td>
                                <td>{{row.appNo}}</td>
                                <td>{{row.zydId}}</td>
                                <td>{{row.createTime| date 'YYYY-MM-DD HH:mm:ss'}}</td>
                                <td><a href="javascript:void(0);" @click="resendClick(row)">重推数据</a></td>
                            </tr>

                            </tbody>
                        </table>
                    </div><!-- /.box-body -->
                </div><!-- /.box -->
            </div>
        </div>
        <nv-pager @paging="paging" :total="total" :size="pageSize" :debug="false"></nv-pager>
    </content>

</template>

<script type="text/babel">
    document.title = "product details";
    import {datepicker, modal}  from "vue-strap"
    import moment  from "moment"
    export default {
        data (){
            return {
                operationType: 0,
                spotId: [],
                appNo: "",
                zydId: "",
                timeMin: util.getMinTimeStr(),
                timeMax: util.getMaxTimeStr(),

                Index: 0,
                total: 0,
                pageIndex: 1,
                pageSize: 20,
                BaseList: [],
                bodyJson: ''
            }
        },

        route: {
            data (transition){
                this.getList()
                transition.next();
            },
        },
        methods: {
            queryClick(){
                this.pageIndex = 1;
                this.paging(1)
            },
            getList (){
                let params = {
                    pagerDto: {
                        pageSize: this.pageSize,
                        pageIndex: this.pageIndex
                    },
                    queryMatchRequestDto: {
                        appNo: this.appNo,
                        zydId: this.zydId,
                        startTime: util.getJavaDate(this.timeMin),
                        endTime: util.getJavaDate(this.timeMax)
                    }
                };

                // $.post(util.apiResource("list"), params).done(data=> {
                util.postLocal("internal/panel/queryMatchRequestDetail", JSON.stringify(params)).done(data=> {
                    let rows = data.matchRequestList || []
                    this.BaseList = rows;
                    this.total = ~~data.totalRows;
                })
            },
            resendClick(row){
                let params = {
                    matchRequestDto: {
                        operationType: row.operationType,
                        spotId: row.spotId,
                        appNo: row.appNo,
                        zydId: row.zydId
                        //                createTime: util.getDate()
                    }
                };
                util.postLocal("internal/resend/resendMatchRequest", JSON.stringify(params)).done(data=> {
                    alert("重推"+data)
                })

            },
            paging(newIndex){
                this.Index = 0
                this.pageIndex = newIndex
                this.getList()
            }
        },
        components: {
            "nvPager": require('../components/pager.vue'),
            datepicker, modal
        }
    }
</script>
