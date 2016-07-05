<template>
    <content>
        <form class="form-inline" role="form" method="post">
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
                                <th>发生时间</th>
                                <th>异常内容</th>
                                <th>status</th>
                            </tr>
                            <tr v-for=" row in BaseList" @click="Index=$index"
                                :class="{actived:Index==$index}">
                                <td>{{row.createTime | date 'YYYY-MM-DD HH:mm:ss'}}</td>
                                <td>{{row.message}}</td>
                                <td>{{row.status}}</td>
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
    import util  from "../libs/util"
    export default {
        data (){
            return {
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
                    startDate: util.getJavaDate(this.timeMin),
                    endDate: util.getJavaDate(this.timeMax)
                };

                util.postLocal("internal/message/query", JSON.stringify(params)).done(data=> {
                    let rows = data.messageDto || []
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
