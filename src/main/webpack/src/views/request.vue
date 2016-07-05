<template>
    <content>
        <form class="form-inline" role="form" method="post">

            <label class="control-label">ip:</label>
            <div class="form-group">
                <input v-model="ip" type="text" class="form-control" placeholder="ip">
            </div>
            <label class="control-label">url:</label>
            <div class="form-group">
                <input v-model="url" type="text" class="form-control" placeholder="url">
            </div>

            <label class="control-label">requestBody:</label>
            <div class="form-group">
                <input v-model="requestBody" type="text" class="form-control" placeholder="requestBody">
            </div>
            <label class="control-label">只搜异常</label>
            <div class="form-group">
                <input v-model="statusCode" type="checkbox">
            </div>
            <label class="control-label"></label>
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
                                <th>url</th>
                                <th>处理时间</th>
                                <th>用时</th>
                                <th>ip</th>
                                <th>方法名</th>
                                <th>请求长度</th>
                                <th>状态</th>
                                <th>返回长度</th>
                                <th>返回内容</th>
                            </tr>
                            <tr v-for=" row in BaseList" @click="Index=$index"
                                :class="{actived:Index==$index}">

                                <td>{{row.url}}</td>
                                <td>{{row.executingTime}}</td>
                                <td>{{row.duration}}</td>
                                <td>{{row.ip}}</td>
                                <td>{{row.method}}</td>
                                <td>{{row.requestLenth}}</td>
                                <td>{{row.statusCode}}</td>
                                <td>{{row.responseLenth}}</td>
                                <td><a href="javascript:void(0);" @click="detailClick(row)">详情</a></td>
                            </tr>

                            </tbody>
                        </table>
                    </div><!-- /.box-body -->
                </div><!-- /.box -->
            </div>
        </div>
        <nv-pager @paging="paging" :total="total" :size="pageSize" :debug="false"></nv-pager>
    </content>
    <modal :show.sync="showModal" :width="1200">
        <div slot="modal-header" class="modal-header">
            <h4 class="modal-title">{{current.id}}</h4>
        </div>
        <div slot="modal-body" class="modal-body">
            <textarea class="form-control" rows="20" style="margin-right:20px;"> {{bodyJson}}</textarea>
        </div>
        <div slot="modal-footer" class="modal-footer">
            <button type="button" class="btn btn-default" @click='showModal = false'>Exit</button>
        </div>
    </modal>
</template>

<script type="text/babel">
    document.title = "product details";
    import {datepicker, modal}  from "vue-strap"
    import moment  from "moment"
    export default {
        data (){
            return {
                ip: "",
                url: "",
                requestBody: "",
                statusCode: 0,
                timeMin: util.getMinTimeStr(),
                timeMax: util.getMaxTimeStr(),

                Index: 0,
                total: 0,
                pageIndex: 1,
                pageSize: 20,
                BaseList: [],
                showModal: false,
                bodyJson: ''
            }
        },
        computed: {
            current(){
                return this.BaseList.length > 0 ? this.BaseList[this.Index] : {}
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
                    monitorDto: {
                        ip: this.ip,
                        url: this.url,
                        statusCode: this.statusCode ? 1 : 0,
                        requestBody: this.requestBody,
                        startDatetime: util.getJavaDate(this.timeMin),
                        endDatetime: util.getJavaDate(this.timeMax)
                    }
                };

                // $.post(util.apiResource("list"), params).done(data=> {
                util.postProxy("internal/request/list", JSON.stringify(params)).done(data=> {
                    let rows = data.requests || []
                    this.BaseList = rows;
                    this.total = ~~data.totalRows;
                })
            },
            detailClick(row){
                this.bodyJson = row.requestBody
                this.showModal = true;
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
