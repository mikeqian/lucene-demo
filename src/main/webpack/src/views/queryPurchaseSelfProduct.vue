<template>
    <content>
        <form class="form-inline" role="form" method="post">
            <label class="control-label">自营商品ID:</label>
            <div class="form-group">
                <input v-model="productId" type="text" class="form-control" placeholder="productIds">
            </div>

            <button type="button" @click="queryClick" class="btn btn-primary" style="margin-left:15px;">Query
            </button>
        </form>

        <div class="row">
            <div class="col-xs-12" id="divSpiderBox">
                <div class="box">

                    <div class="box-body table-responsive no-padding">
                        <table class="table table-hover">
                            <tbody>
                            <tr>
                                <th>商品ID</th>
                                <th>品名</th>
                                <th>材质</th>
                                <th>规格</th>
                                <th>钢厂</th>
                                <th>单件重</th>
                                <th>数量</th>
                                <th>价格</th>
                            </tr>
                            <tr v-for=" row in BaseList" @click="Index=$index"
                                :class="{actived:Index==$index}">
                                <td>{{row.productId}}</td>
                                <td>{{row.categoryName}}</td>
                                <td>{{row.materialName}}</td>
                                <td>{{row.specificationName}}</td>
                                <td>{{row.factoryName}}</td>
                                <td>{{row.pieceWeight}}</td>
                                <td>{{row.quantity}}</td>
                                <td>{{row.price}}</td>
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
    export default {
        data (){
            return {
                productId: "",
                ids:[],

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
                //this.getList()
                transition.next();
            },
        },
        methods: {
            queryClick(){
                this.ids = this.productId.split(" ")
                let params = {
                    productIds: this.ids
                };

                util.postQesProxy("purchase/selfProductList", JSON.stringify(params)).done(data=> {
                    let rows = data.productDetails || []
                    this.BaseList = rows;
                })
            },
            getList (){
                let params = {
                    productIds: this.productId
                };

                util.postQesProxy("purchase/selfProductList", JSON.stringify(params)).done(data=> {
                    let rows = data.productDetails || []
                    this.BaseList = rows;
                })
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
