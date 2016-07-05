<template>
    <form class="form-inline ConditionContainer" role="form" method="post">
        <label class="control-label">日期:</label>
        <div class="form-group">
            <datepicker
                    :value.sync="date" :format="'yyyy-MM-dd'">
            </datepicker>
        </div>

        <!--<button type="button" @click="queryClick" class="btn btn-primary" style="margin-left:15px;">Query</button>-->
    </form>

    <my-echarts :type="type" name="库存报表" :option="chartsData"></my-echarts>


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
                data: []
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
            },

        ]
    };

    option.series.forEach(item=>item.itemStyle = {
        normal: {
            label: {
                position: "top",
                show: true
            }
        }
    });



    export default {
        data(){
            return {
                date: moment().format("YYYY-MM-DD"),
                chartsData: {},
                apiType: 0,
            }
        },
        route: {
            data (transition){
                this.getList();
                transition.next();
            }
        },
        methods: {
            getList(){

                let params = {
                    startDate: util.getShortDateStr(moment(this.date).add(-6, 'd')),
                    endDate: util.getShortDateStr(moment(this.date))
                };
                util.postLocal("internal/report/stock", JSON.stringify(params)).done((data)=> {
                    let dto = data.dailyReportDto;
                    let dates = util.sortDateStrArr(Object.keys(dto))
                    option.xAxis[0].data = dates
                    option.series.forEach((item, index)=> {
                        let channel = index + 1;
                        item.data = dates.map(a=>dto[a]).map(dateData=> {
                            let item = dateData.find(_item=>_item.channel === channel)
                            return item ? item.count : 0
                        });
                    })
                    this.chartsData = util.setOption(option)
                    this.$broadcast("echarts_refresh")
                });
            }
        },
        watch: {
            'date': "getList"
        },
        components: {
            "myEcharts": require('../../components/myecharts.vue'),
            datepicker
        }
    }
</script>

