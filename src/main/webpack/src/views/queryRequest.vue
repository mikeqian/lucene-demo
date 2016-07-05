<template>
    <content>
        <form class="form-inline" role="form" method="post">
            <label class="control-label">requestBody:</label>
            <div class="form-group">
                <input v-model="requestBody" type="text" class="form-control" placeholder="requestBody">
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
                                <th>请求长度</th>
                                <th>状态</th>
                                <th>请求</th>
                                <th>返回值</th>
                            </tr>
                            <tr v-for=" row in BaseList" @click="Index=$index"
                                :class="{actived:Index==$index}">
                                <td>{{row.url}}</td>
                                <td>{{row.createTime}}</td>
                                <td>{{row.endTicket - row.startTicket}}</td>
                                <td>{{row.requestBodyLength}}</td>
                                <td>{{row.responseHttpCode}}</td>
                                <td><a href="javascript:void(0);" @click="requestClick(row)">详情</a></td>
                                <td><a href="javascript:void(0);" @click="responseClick(row)">详情</a></td>
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
                    startTime: util.getJavaDate(this.timeMin),
                    endTime: util.getJavaDate(this.timeMax),
                    requestBodyText: this.requestBody
                };

                util.postLocal("internal/panel/queryEngineRequestDetail", JSON.stringify(params)).done(data=> {
                    let rows = data.productRequestList || []
                    this.BaseList = rows;
                    this.total = ~~data.totalRows;
                })
            },
            requestClick(r){
                this.bodyJson = r.requestBodyText;
                this.showModal = true;
            },
            responseClick(s){
                this.bodyJson = s.responseBodyText;
                this.showModal = true;
            },
            paging(newIndex){
                this.Index = 0;
                this.pageIndex = newIndex;
                this.getList();
            }
        },
        components: {
            "nvPager": require('../components/pager.vue'),
            datepicker, modal
        }
    }
</script>
