<template>
    <form class="form-inline ConditionContainer" role="form" method="post">
        <label class="control-label">日期:</label>
        <div class="form-group">
            <datepicker
                    :value.sync="date" :format="'yyyy-MM-dd'">
            </datepicker>
        </div>
    </form>

    <my-echarts :type="type" name="搜索报表" :option="chartsData"></my-echarts>
</template>

<script type="text/babel">
    import {datepicker}  from "vue-strap"
    import moment  from "moment"
    import util  from "../../libs/util"

    let option = {
        color: ['green'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'       // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ['搜索次数']
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
                name: '搜索次数',
                type: 'bar',
                itemStyle: {                // 系列级个性化
                    normal: {
                        barBorderWidth: 6,
                        color: 'blue'
                    }
                },
                data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

            }
        ]
    };


    export default {
        route: {
            data (transition){
                this.getList()
                transition.next();
            },
        },
        data(){
            return {
                date: moment().add('days',-1).format("YYYY-MM-DD"),
                chartsData: {},
                dto: {}
            }
        },
        methods: {
            initOption(){
                let dto = this.dto
                let dates = Object.keys(dto).sort((a, b)=>parseInt(a) - parseInt(b));
                option.xAxis[0].data = dates;
                option.series[0].data = dates.map(a=> {
                            return dto[a].count;
                        }
                );
                this.chartsData = util.setOption(option)
                this.$broadcast("echarts_refresh")
            },

            getList(){
                let params = {
                    startTime: util.getJavaDate(util.getMinTimeStr(this.date)),
                    endTime: util.getJavaDate(util.getMaxTimeStr(this.date))
                };
                util.postLocal("internal/report/querySearchRequestReport", JSON.stringify(params)).done((data)=> {
                    this.dto = data.totalSearchReportList;
                    this.initOption()
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

