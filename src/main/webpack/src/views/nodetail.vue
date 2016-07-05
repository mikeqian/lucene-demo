<template>
    <content>
        <form class="form-inline" role="form" method="post">
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
                                <th>id</th>
                                <th>channel</th>
                                <th>产品线</th>
                                <th>品</th>
                                <th>材</th>
                                <th>规</th>
                                <th>钢</th>
                            </tr>
                            <tr v-for=" row in BaseList" @click="Index=$index"
                                :class="{actived:Index==$index}">

                                <td>{{row.id}}</td>
                                <td>{{row.channel}}</td>
                                <td>{{row.productLine}}</td>
                                <td>{{row.categoryName}}</td>
                                <td>{{row.materialName}}</td>
                                <td>{{row.specificationName}}</td>
                                <td>{{row.factoryName}}</td>
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
                    }
                };

                // $.post(util.apiResource("list"), params).done(data=> {
                util.postProxy("internal/product/nonExistent", JSON.stringify(params)).done(data=> {
                    let rows = data.nonExistentDetailList || []
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
            modal
        }
    }
</script>
