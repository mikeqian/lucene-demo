<template>
    <content>
        <form class="form-inline" role="form" method="post">

            <label class="control-label">sessionId:</label>
            <div class="form-group">
                <input v-model="sessionId" type="text" class="form-control" placeholder="sessionId">
            </div>
            <label class="control-label">productPkId:</label>
            <div class="form-group">
                <input v-model="productPkId" type="text" class="form-control" placeholder="productPkId">
            </div>

            <label class="control-label">description:</label>
            <div class="form-group">
                <input v-model="description" type="text" class="form-control" placeholder="description">
            </div>

            <label class="control-label">state:</label>
            <div class="form-group">
                <input v-model="state" type="text" class="form-control" placeholder="state">
            </div>

            <br>
            <div style="margin-top: 10px;">

                <label class="control-label">last update time:</label>
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

            </div>
        </form>
        <div class="row  TextCenter ">
            <div class="col-xs-12" id="divSpiderBox">
                <div class="box">

                    <div class="box-body table-responsive no-padding">
                        <table class="table table-hover">
                            <tbody>
                            <tr>
                                <th>id</th>
                                <th>sessionId</th>
                                <th>productPkId</th>
                                <th>description</th>
                                <th>state</th>
                                <th>createTime</th>
                            </tr>
                            <tr v-for=" row in BaseList" @click="Index=$index"
                                :class="{actived:Index==$index}">

                                <td>{{row.id}}</td>
                                <td>{{row.sessionId}}</td>
                                <td>{{row.productPkId}}</td>
                                <td>{{row.description}}</td>
                                <td>{{row.state}}</td>
                                <td>{{row.createTime| date 'YYYY-MM-DD HH:mm:ss'}}</td>
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
                sessionId: "",
                productPkId: "",
                description: "",
                state: "",
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
            },
            deactivate (transition){
                transition.next();
            }
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
                    queryQueueDto: {
                        sessionId: this.sessionId,
                        productPkId: this.productPkId,
                        description: this.description,
                        state: this.state,
                        startDatetime: util.getJavaDate(this.timeMin),
                        endDatetime: util.getJavaDate(this.timeMax)
                    }
                };

                // $.post(util.apiResource("list"), params).done(data=> {
                util.postProxy("internal/queue/query", JSON.stringify(params)).done(data=> {
                    let rows = data.quequDto || []
                    this.BaseList = rows;
                    this.total = ~~data.totalRows;
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
