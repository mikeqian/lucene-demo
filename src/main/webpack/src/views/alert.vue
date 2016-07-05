<template>
    <content>
        <form class="form-inline" role="form" method="post">
            <time-range :time-min.sync="timeMin" :time-max.sync="timeMax"></time-range>
            <label class="control-label">Type:</label>
            <div class="form-group">
                <select class="form-control" v-model="type">
                    <option value="0">全部</option>
                    <option value="1">未知异常</option>
                    <option value="2">无码单</option>
                    <option value="3">处理未结束</option>
                </select>
            </div>
            <button type="button" @click="queryClick" class="btn btn-primary" style="margin-left:15px;">Query
            </button>
        </form>
        <div class="row  TextCenter ">
            <div class="col-xs-12" id="divSpiderBox">
                <div class="box">
                    <!-- /.box-header -->
                    <div class="box-body table-responsive no-padding">
                        <table class="table table-hover">
                            <tbody>
                            <tr>
                                <th>预警类型</th>
                                <th>预警状态</th>
                                <th>预警描述</th>
                                <th>createTime</th>
                                <th>处理时间</th>
                            </tr>
                            <tr v-for="row in BaseList">
                                <td>{{row.type|dic '未知异常,无码单,未结束'}}</td>
                                <td>{{row.state|assert '已处理' '未处理'}}</td>
                                <td>
                                    <div style="width: 850px;">
                                        {{row.description}}
                                    </div>
                                </td>
                                <td>{{row.createTime | date 'YYYY-MM-DD HH:mm:ss'}}</td>
                                <td>{{row.dealTime | date 'YYYY-MM-DD HH:mm:ss'}}</td>
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
    import util  from "../libs/util"


    export default {
        data (){
            return {
                timeMin: util.getMinTimeStr(),
                timeMax: util.getMaxTimeStr(),
                type: 0,

                Index: 0,
                total: 0,
                pageIndex: 1,
                pageSize: 20,
                BaseList: [],
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
                    type: this.type,
                    startTime: util.getJavaDate(this.timeMin),
                    endTime: util.getJavaDate(this.timeMax)
                };

                util.postLocal("internal/alert/query", JSON.stringify(params)).done(data=> {
                    let rows = data.alertDtoList || []
                    this.BaseList = rows;
                    this.total = ~~data.totalRows;
                })
            },
            detailClick(row){
                this.bodyJson = row.requestBody
                this.showModal = true;
            },
            paging(newIndex){
                this.pageIndex = newIndex
                this.getList()
            }
        },
        components: {
            "nvPager": require('../components/pager.vue'),
            "time-range": require('../components/timeRange.vue'),
            datepicker, modal
        }
    }
</script>
