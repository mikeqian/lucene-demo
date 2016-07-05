<template>
    <content>
        <form class="form-inline" role="form" method="post">
            <label class="control-label">PKID:</label>
            <div class="form-group">
                <input v-model="pkid" type="text" class="form-control" placeholder="PKID">
            </div>
            <label class="control-label">Channel:</label>
            <div class="form-group">
                <select class="form-control" v-model="channel">
                    <option value="0">全部</option>
                    <option value="1">自营</option>
                    <option value="2">联营</option>
                    <option value="3">撮合</option>
                </select>
            </div>
            <label class="control-label">batchNo:</label>
            <div class="form-group">
                <input v-model="batchNo" type="text" class="form-control" placeholder="batchNo">
            </div>
            <label class="control-label">last update time:</label>
            <div class="form-group">
                <datepicker
                        :value.sync="timeMin" :format="'yyyy-MM-dd'">
                </datepicker>

                <datepicker
                        :value.sync="timeMax" :format="'yyyy-MM-dd'">
                </datepicker>
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
                                <th>pkid</th>
                                <th>channel</th>
                                <th>品</th>
                                <th>材</th>
                                <th>规</th>
                                <th>钢</th>
                                <th>批次号</th>
                                <th>状态</th>
                                <th>lastUpdateTime</th>
                                <th>操作</th>
                            </tr>
                            <tr v-for=" row in BaseList" @click="Index=$index"
                                :class="{actived:Index==$index}">

                                <td>{{row.id}}</td>
                                <td>{{row.channel}}</td>
                                <td>{{row.categoryName}}</td>
                                <td>{{row.materialName}}</td>
                                <td>{{row.specificationName}}</td>
                                <td>{{row.factoryName}}</td>
                                <td>{{row.batchNo}}</td>
                                <td>{{row.status|Status}}</td>
                                <td>{{row.lastUpdateTime | date 'YYYY-MM-DD HH:mm:ss'}}</td>
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
            <!--<h4 class="modal-title">{{current.id}}</h4>-->
            <form class="form-inline" role="form" method="post">
                <div v-if="channel == 1">
                    <label class="control-label">productPkId:</label>
                    <input v-model="productPkId" type="text" readonly="readonly" class="form-control"
                           placeholder={{current.id}}>
                    <button type="button" @click="resendSelfClick()" class="btn btn-primary" style="margin-left:15px;">
                        自营重推数据
                    </button>
                </div>
                <div v-if="channel == 2">
                    <label class="control-label">productPkId:</label>
                    <input v-model="productPkId" type="text" readonly="readonly" class="form-control"
                           placeholder={{current.id}}>
                    <button type="button" @click="resendUnionClick()" class="btn btn-primary" style="margin-left:15px;">
                        联营重推数据
                    </button>
                </div>
                <div v-if="channel == 3">
                    <label class="control-label">productPkId:</label>
                    <input v-model="productPkId" type="text" readonly="readonly" class="form-control"
                           placeholder={{current.id}}>
                    <!--<button type="button" @click="resendMatchClick()" class="btn btn-primary" display=="none" style="margin-left:15px;" >-->
                        <!--撮合重推数据-->
                    <!--</button>-->
                </div>
            </form>
        </div>

        <div slot="modal-body" class="modal-body">
            <textarea class="form-control" rows="6" style="margin-right:20px;"> {{stock|json}}</textarea>
            <br>
            <textarea class="form-control" rows="10" style="margin-right:20px;"> {{stockDetail|json}}</textarea>
            <br>
            <label v-show="stock.productType==2">非关联品:</label>
            <textarea class="form-control" rows="6" style="margin-right:20px;"> {{stockDetailQuantity|json}}</textarea>
        </div>
        <div slot="modal-footer" class="modal-footer">
            <button type="button" class="btn btn-default" @click='showModal = false'>Exit</button>
        </div>
    </modal>


</template>

<script type="text/babel">
    document.title = "商品管理";
    import {datepicker, modal}  from "vue-strap"
    import moment  from "moment"
    export default {
        data (){
            return {
                selfId:"",
                channel: 0,
                mIds: [],
                pkid: "",
                channel: 0,
                batchNo: "",
                timeMin: moment().format("YYYY-MM-DD"),
                timeMax: moment().format("YYYY-MM-DD"),

                Index: 0,
                total: 0,
                pageSize: 20,
                BaseList: [],
                pageIndex: 1,
                showModal: false,
                stock: {},
                stockDetail: {},
                stockDetailQuantity: {}
            }
        },
        computed: {
            current(){
                var item = this.BaseList.length > 0 ? this.BaseList[this.Index] : {}
                return item
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
                    queryProductDto: {
                        id: this.pkid,
                        batchNo: this.batchNo,
                        channel: this.channel,
                        startTime: util.getJavaDate(this.timeMin + " 00:00:01"),
                        endTime: util.getJavaDate(this.timeMax + " 23:59:59")
                    }
                };

                // $.post(util.apiResource("list"), params).done(data=> {
                util.postProxy("internal/product/list", JSON.stringify(params)).done(data=> {
                    let rows = data.products || [];
                    this.BaseList = rows;
                    this.total = ~~data.totalRows;
                })
            },
            detailClick(row){
                this.channel = row.channel
                this.mIds = [row.id.substring(1)]
                this.selfId = row.id
                util.postProxy("internal/stock/detail", row.id).done((data)=> {
                    this.stock = data.productDetail
                    this.stockDetail = data.stockDetails
                    this.stockDetailQuantity = data.stockDetailQuantitys
                    this.showModal = true;
                })
            },
            resendUnionClick(){
                let params = {
                    ids: this.mIds
                };
                util.postLocal("internal/product/sync", JSON.stringify(params)).done(data=> {
                    alert("重推" + data)
                })

            },
            resendSelfClick(){
                util.postQesProxy("internal/self/syncOne?id="+this.selfId,"").done(data=> {
                 alert("重推" + data)
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
