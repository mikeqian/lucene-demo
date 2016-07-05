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

    <div class="DivChartsContainer">
        <my-echarts :type="type" :name="'跟踪报表'" :option="chartsData"></my-echarts>
    </div>

</template>

<script type="text/babel">
    import {datepicker}  from "vue-strap"
    import moment  from "moment"
    import util  from "../../libs/util"

    //1,2,3,6
    const StateDic = ["收到请求", "推送消息", "SE反馈", "主动丢弃"]
    const StateIndex = [1, 2, 3, 6]

    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: StateDic
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
        series: StateDic.map(a=> {
            return {
                name: a,
                type: 'bar',
                data: []
            }
        })
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
                    startDate: util.getShortDateStr(moment(this.date).add(-4, 'd')),
                    endDate: util.getShortDateStr(moment(this.date))
                };
                util.postLocal("internal/report/stockState", JSON.stringify(params)).done((data)=> {
                    let dto = data.dailyStateTrackingDto;
                    let dates = util.sortDateStrArr(Object.keys(dto))
                    option.xAxis[0].data = dates
                    option.series.forEach((item, index)=> {
                        let state = StateIndex[index]
                        item.data = dates.map(a=>dto[a]).map(dateData=> {
                            let item = dateData.find(_item=>_item.state === state)
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
<style>

</style>
