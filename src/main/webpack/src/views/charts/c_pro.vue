<template>
    <form class="form-inline ConditionContainer" role="form" method="post">
        <label class="control-label">日期:</label>
        <div class="form-group">
            <datepicker
                    :value.sync="date" :format="'yyyy-MM-dd'">
            </datepicker>
        </div>
        <label class="control-label">api:</label>
        <div class="form-group">
            <select class="form-control" v-model="apiName" id="c_pro_apiName">
                <option value="product/update">product</option>
                <option value="product/price">price</option>
                <option value="stock/quantity">quantity</option>
                <option value="stock/info">stock</option>
                <option value="product/disable">disable</option>
            </select>
        </div>
        <!--<button type="button" @click="queryClick" class="btn btn-primary" style="margin-left:15px;">Query</button>-->
    </form>

    <my-echarts :type="type" name="产品报表" :option="chartsData"></my-echarts>
</template>

<script type="text/babel">
    import {datepicker}  from "vue-strap"
    import moment  from "moment"
    import util  from "../../libs/util"

    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['自营', '联营', '撮合']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '自营',
                type: 'bar',
                data: [],
            },
            {
                name: '联营',
                type: 'bar',
                stack: '营销',
                data: [],

            },

            {
                name: '撮合',
                type: 'bar',
                data: [],
            }
        ]
    };


    export default {

        ready(){

        },
        route: {
            data (transition){
                this.getList()
                // transition.next();
            },
        },
        data(){
            return {
                date: moment().format("YYYY-MM-DD"),
                chartsData: {},
                dto: {},
                apiName: "product/update"
            }
        },
        methods: {
            queryClick(){
                this.chartsData.series[0].data[5] = this.chartsData.series[0].data[5] + 1;
            },
            initOption(){
                let dto = this.dto
                let dates = Object.keys(dto).sort((a, b)=>parseInt(a) - parseInt(b));
                option.xAxis[0].data = dates;
                option.series.forEach((item, index)=> {
                    let channel = index + 1;
                    item.data = dates.map(a=>dto[a]).map(dateData=> {
                        let item = dateData.find(_item=>_item.channel === channel && _item.apiName === this.apiName)
                        return item ? item.count : 0
                    });
                })
                this.chartsData = util.setOption(option)
                this.$broadcast("echarts_refresh")
            },

            getList(){
                let params = {
                    startTime: util.getJavaDate(util.getMinTimeStr(this.date)),
                    endTime: util.getJavaDate(util.getMaxTimeStr(this.date)),
                    type: 1
                };
                util.postLocal("internal/report/requestCount", JSON.stringify(params)).done((data)=> {
                    this.dto = params.type === 1 ? data.reportByHour : data.reportByDay;
                    this.initOption()
                });
            }
        },
        watch: {
            'date': "getList",
            'apiName': "initOption"
        },
        components: {
            "myEcharts": require('../../components/myecharts.vue'),
            datepicker
        }
    }
</script>

