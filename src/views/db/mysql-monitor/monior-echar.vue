<template>
  <div>
    <div>
      <el-date-picker
        v-model="time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        @change="timeChange"
      ></el-date-picker>
    </div>
    <el-row :gutter="32" style="margin-top:20px;">
      <el-col :span="23">
        <div class="chart-wrapper">
          <div id="tps" style="width:100%;height:200px;"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { tps } from "@/api/overview";
import echarts from "echarts";
export default {
  data() {
    return {
      chart: null,
      time: [],
      lineChartData: []
    };
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.initChart();
    // });
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  mounted() {
    this.getEchars();
  },
  methods: {
    getEchars(){
      const {hostip,dsn} = this.$route.query
      tps({
        hostip,
        dsn
      })
        .then(({results:data}) => {
          if (document.getElementById('tps')) {
            this.chart = echarts.init(document.getElementById('tps'));
            this.chart.setOption(this.options(data.time,data.value))
          }
        })
        .catch(err => this.$message.error(err.message));
    },
    timeChange(val) {
      const {hostip,dsn} = this.$route.query
        tps({
            start_tm:val[0],
            end_time:val[1],
            hostip,
            dsn
        })
        .then(({results:data}) => {
            this.chart = echarts.init(document.getElementById('tps'));
            this.chart.setOption(this.options(data.time,data.value))
        })
        .catch(err => this.$message.error(err.message));
    },
    options(time,value) {
      let options = {
        title: {
            text:'QPS'
        },
        xAxis: {
          data:time,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ["expected"],
          show:false
        },
        series: [
          {
            name: "expected",
            itemStyle: {
              normal: {
                color: "#FF005A",
                lineStyle: {
                  color: "#FF005A",
                  width: 2
                }
              }
            },
            smooth: true,
            type: "line",
            data: value,
            animationDuration: 2800,
            animationEasing: "cubicInOut"
          }
        ]
      }
      return options
    }
  }
};
</script>
<style lang="sass" scoped>

</style>
