<template>
    <div class="DivChartsContainer">
        <div style="text-align: center;height: 30px;font-weight: bold"><h4>{{name}}</h4></div>
        <slot>
            <div id="divCharts" style="width: 100%;height: 500px;"></div>
        </slot>
    </div>
</template>
<script type="text/babel">
    import echarts from 'echarts';
    export default {
        props: {
            type: {
                type: Number,
                default: 1
            },
            name: {
                type: String,
                default: ""
            },
            chartid: {
                type: String,
                default: "divCharts"
            },

            option: {
                type: Object,
                default: {}
            }
        },
        created () {
            this.$on("echarts_refresh", this.refresh)
        },

        ready(){
            // 基于准备好的dom，初始化echarts实例
            var myChart = this.myChart = echarts.init(document.getElementById(this.chartid));
            // 指定图表的配置项和数据


            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(this.option);
        },
        data (){
            return {
                myChart: {}
            }
        },
        watch: {
            'option': {
                handler: function (val, oldVal) {
                    this.refresh();
                },
                deep: false
            },

        },
        computed: {},
        methods: {
            refresh(){
                if (this.myChart.setOption) {
                    this.myChart.setOption(this.option);
                } else {
                }
            }
        }
    }
</script>


<style>

</style>