<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
var now = +new Date(1997, 9, 3);
var oneDay = 24 * 3600 * 1000;
var value = Math.random() * 1000;

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'lineChartLogin'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    }
  },
  data() {
    return {
      chart: null,
      timer: null,
      data: []
    }
  },
  mounted() {
    this.initChart()
    if (this.timer) {
      clearTimeout(this.timer)
    }
    /* this.timer = setInterval(() => {

      for (var i = 0; i < 5; i++) {
        this.data.shift();
        this.data.push(this.randomData());
      }

      this.chart.setOption({
        series: [{
          data: this.data
        }]
      });
    }, 1000);*/
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
    this.timer = null
  },
  methods: {
    randomData() {

      now = new Date(+now + oneDay)
      value = value + Math.random() * 21 - 10
      return {
        name: now.toString(),
        value: [
          [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'),
          Math.round(value)
        ]
      }
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      for (var i = 0; i < 1000; i++) {
        this.data.push(this.randomData());
      }
      const data = this.data
      this.chart.setOption({
        backgroundColor: '#394056',
        title: {
          top: 20,
          text: 'logins',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          left: '40%'
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            params = params[0];
            var date = new Date(params.name);
            return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1];
          },
          axisPointer: {
            animation: false
          }
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        series: [{
          name: '模拟数据',
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: data
        }]
      })
    }
  }
}
</script>
